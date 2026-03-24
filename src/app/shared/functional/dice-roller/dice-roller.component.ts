import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import CannonDebugger from 'cannon-es-debugger';
import { degToRad } from 'three/src/math/MathUtils.js';

@Component({
  selector: 'app-dice-roller',
  standalone: true,
  templateUrl: './dice-roller.component.html',
  styleUrl: './dice-roller.component.scss',
})
export class DiceRollerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('diceCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @Output() rollFinished = new EventEmitter<number>();
  @Output() closeEvent = new EventEmitter<void>();

  @Input() diceTypes: string[] = ['d20'];
  private cannonDebugger: any;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private world!: CANNON.World;
  private loader = new GLTFLoader();
  private rollStartTime: number = 0;
  private debugArrow: THREE.ArrowHelper | null = null;
  private allStoppedSince: number | null = null;
  private readonly finalStableWindowMs = 600;
  private lastTime = 0;

  private _rollModifier: number = 0;
  @Input() set rollModifier(value: number) {
    this._rollModifier = value;
  }
  get rollModifier() {
    return this._rollModifier;
  }
  private _diceCountModifier: 'adv' | 'disadv' | null = null;
  @Input() set diceCountModifier(value: 'adv' | 'disadv' | null) {
    this._diceCountModifier = value;
  }
  get diceCountModifier() {
    return this._diceCountModifier;
  }

  private diceObjects: {
    mesh: THREE.Mesh;
    body: CANNON.Body;
    type: string;
    stopped: boolean;
    stableCount: number;
  }[] = [];

  private animationId: number = 0;
  resultText: string = '';
  isRolling = false;
  private diceConfig: {
    [key: string]: { scale: number; mass: number; radius: number };
  } = {
      d4: { scale: 1, mass: 1, radius: 1.0 },
      d6: { scale: 1, mass: 1, radius: 0.7 },
      d8: { scale: 1, mass: 1, radius: 1.0 },
      d10: { scale: 1, mass: 1, radius: 0.8 },
      d12: { scale: 1, mass: 1, radius: 1.0 },
      d20: { scale: 1, mass: 1, radius: 1.1 },
    };

  private diceMaterial!: CANNON.Material;
  private floorMaterial!: CANNON.Material;

  ngAfterViewInit() {
    this.initThree();
    this.initPhysics();
    this.loadAndCreateDice();
    this.lastTime = performance.now();
    this.animate();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
    }
    this.diceObjects = [];
    this.rollModifier = 0;
  }

  private initThree() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 20, 0);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(width, height);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(-10, 50, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    const d = 50;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    this.scene.add(dirLight);

    const floorGeo = new THREE.PlaneGeometry(100, 100);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.3 });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    this.scene.add(floorMesh);
  }

  private initPhysics() {
    this.world = new CANNON.World();
    this.world.gravity.set(0, -3 * 10, 0);
    this.world.broadphase = new CANNON.NaiveBroadphase();
    (this.world.solver as CANNON.GSSolver).iterations = 20;
    this.world.allowSleep = true;

    this.diceMaterial = new CANNON.Material('diceMat');
    this.floorMaterial = new CANNON.Material('floorMat');

    const diceContact = new CANNON.ContactMaterial(
      this.diceMaterial,
      this.floorMaterial,
      { friction: 0.3, restitution: 0.4 },
    );
    this.world.addContactMaterial(diceContact);

    const diceDiceContact = new CANNON.ContactMaterial(
      this.diceMaterial,
      this.diceMaterial,
      { friction: 0.3, restitution: 0.4 },
    );
    this.world.addContactMaterial(diceDiceContact);

    const floorBody = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Plane(),
      material: this.floorMaterial,
    });
    floorBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      -Math.PI / 2,
    );
    this.createWalls();
    this.world.addBody(floorBody);
  }

  private loadAndCreateDice() {
    this.diceObjects = [];
    let typesToLoad = [...this.diceTypes];
    if (this.diceCountModifier) {
      typesToLoad = [...this.diceTypes, ...this.diceTypes];
    }
    const totalDiceCount = typesToLoad.length;

    typesToLoad.forEach((type, index) => {
      const typeKey = type.toLowerCase();
      const safeType = this.diceConfig[typeKey] ? typeKey : 'd6';
      const xOffset = (index - (totalDiceCount - 1) / 2) * 3;
      this.loadModel(safeType, xOffset, totalDiceCount);
    });
  }

  private loadModel(type: string, xOffset: number, totalDiceCount: number) {
    const url = `assets/dices/${type}.glb`;
    const config = this.diceConfig[type];

    this.loader.load(
      url,
      (gltf) => {
        let foundMesh: THREE.Mesh | null = null;
        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) foundMesh = child as THREE.Mesh;
        });

        if (!foundMesh) return;

        const mesh = foundMesh as THREE.Mesh;

        const visualGeometry = mesh.geometry.clone();
        visualGeometry.center();
        visualGeometry.scale(config.scale, config.scale, config.scale);

        const material = mesh.material as THREE.MeshStandardMaterial;
        const newMesh = new THREE.Mesh(visualGeometry, material);
        newMesh.castShadow = true;
        newMesh.receiveShadow = true;
        newMesh.position.set(xOffset, 10, 0);

        if (type === 'd4') {
          visualGeometry.translate(0, 0.3, -0.2);
          visualGeometry.rotateY(degToRad(60));
          visualGeometry.rotateX(degToRad(40));
          visualGeometry.rotateZ(degToRad(-45));
        } else if (type === 'd10') {
          visualGeometry.translate(0, 0, 0);
          visualGeometry.rotateY(degToRad(-9));
          visualGeometry.rotateX(degToRad(30));
          visualGeometry.rotateZ(degToRad(-12.5));
        } else if (type === 'd20') {
          visualGeometry.translate(0, 0, 0);
          visualGeometry.rotateY(degToRad(1));
          visualGeometry.rotateX(degToRad(5));
          visualGeometry.rotateZ(degToRad(18));
        }
        this.scene.add(newMesh);

        const physicsShape = this.createPhysicsShape(type, config.radius);

        const body = new CANNON.Body({
          mass: config.mass,
          material: this.diceMaterial,
          shape: physicsShape,
          linearDamping: 0.1,
          angularDamping: 0.1,
        });
        body.position.copy(newMesh.position as any);

        body.quaternion.setFromEuler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        );

        this.world.addBody(body);

        this.diceObjects.push({
          mesh: newMesh,
          body,
          type,
          stopped: false,
          stableCount: 0,
        });

        if (this.diceObjects.length === totalDiceCount) {
          this.throwDice();
        }
      },
      undefined,
      (error) => console.error(error),
    );
  }

  private createPhysicsShape(type: string, radius: number): CANNON.Shape {
    let geometry: THREE.BufferGeometry;

    switch (type) {
      case 'd4':
        geometry = new THREE.TetrahedronGeometry(radius);
        return this.createConvexPolyhedron(geometry);
      case 'd6':
        return new CANNON.Box(new CANNON.Vec3(radius, radius, radius));
      case 'd8':
        geometry = new THREE.OctahedronGeometry(radius);
        return this.createConvexPolyhedron(geometry);
      case 'd10':
        return this.createD10Shape(radius);
      case 'd12':
        geometry = new THREE.DodecahedronGeometry(radius);
        return this.createConvexPolyhedron(geometry);
      case 'd20':
        geometry = new THREE.IcosahedronGeometry(radius);
        geometry.rotateX(degToRad(36));
        geometry.rotateZ(degToRad(36));
        return this.createConvexPolyhedron(geometry);
      default:
        return new CANNON.Box(new CANNON.Vec3(radius, radius, radius));
    }
  }

  private createWalls() {
    const dist = this.camera.position.y;
    const fovRad = (this.camera.fov * Math.PI) / 180;
    const visibleHeight = 2 * Math.tan(fovRad / 2) * dist;
    const aspect = window.innerWidth / window.innerHeight;
    const visibleWidth = visibleHeight * aspect;
    const width = visibleWidth;
    const depth = visibleHeight;
    const wallHeight = 3;
    const wallThickness = 1;

    const addWall = (x: number, z: number, w: number, d: number) => {
      const shape = new CANNON.Box(
        new CANNON.Vec3(w / 2, wallHeight / 2, d / 2),
      );
      const body = new CANNON.Body({
        mass: 0,
        shape: shape,
        material: this.floorMaterial,
      });
      body.position.set(x, wallHeight / 2, z);
      this.world.addBody(body);
    };

    addWall(-width / 2, 0, wallThickness, depth);
    addWall(width / 2, 0, wallThickness, depth);
    addWall(0, -depth / 2, width, wallThickness);
    addWall(0, depth / 2, width, wallThickness);
  }

  private createD10Shape(radius: number): CANNON.ConvexPolyhedron {
    const height = radius;
    const k = radius * 0.2;
    const vertices = [];
    vertices.push(0, height, 0);
    vertices.push(0, -height, 0);

    const segments = 10;
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const y = i % 2 === 0 ? k : -k;
      vertices.push(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
    }

    const indices = [];
    const ringStart = 2;
    for (let i = 0; i < segments; i++) {
      const current = ringStart + i;
      const next = ringStart + ((i + 1) % segments);
      indices.push(0, next, current);
      indices.push(1, current, next);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.setIndex(indices);

    return this.createConvexPolyhedron(geo);
  }

  private createConvexPolyhedron(
    geometry: THREE.BufferGeometry,
  ): CANNON.ConvexPolyhedron {
    const positionAttribute = geometry.attributes['position'];
    const vertices: CANNON.Vec3[] = [];
    const faces: number[][] = [];
    const keyToId: { [key: string]: number } = {};

    const getVertexId = (x: number, y: number, z: number) => {
      const key = `${x.toFixed(4)}_${y.toFixed(4)}_${z.toFixed(4)}`;
      if (keyToId[key] !== undefined) return keyToId[key];
      const id = vertices.length;
      vertices.push(new CANNON.Vec3(x, y, z));
      keyToId[key] = id;
      return id;
    };

    if (geometry.index) {
      for (let i = 0; i < geometry.index.count; i += 3) {
        faces.push([
          getVertexId(
            positionAttribute.getX(geometry.index.getX(i)),
            positionAttribute.getY(geometry.index.getX(i)),
            positionAttribute.getZ(geometry.index.getX(i)),
          ),
          getVertexId(
            positionAttribute.getX(geometry.index.getX(i + 1)),
            positionAttribute.getY(geometry.index.getX(i + 1)),
            positionAttribute.getZ(geometry.index.getX(i + 1)),
          ),
          getVertexId(
            positionAttribute.getX(geometry.index.getX(i + 2)),
            positionAttribute.getY(geometry.index.getX(i + 2)),
            positionAttribute.getZ(geometry.index.getX(i + 2)),
          ),
        ]);
      }
    } else {
      for (let i = 0; i < positionAttribute.count; i += 3) {
        faces.push([
          getVertexId(
            positionAttribute.getX(i),
            positionAttribute.getY(i),
            positionAttribute.getZ(i),
          ),
          getVertexId(
            positionAttribute.getX(i + 1),
            positionAttribute.getY(i + 1),
            positionAttribute.getZ(i + 1),
          ),
          getVertexId(
            positionAttribute.getX(i + 2),
            positionAttribute.getY(i + 2),
            positionAttribute.getZ(i + 2),
          ),
        ]);
      }
    }

    return new CANNON.ConvexPolyhedron({ vertices, faces });
  }

  throwDice() {
    if (this.isRolling) return;
    this.isRolling = true;
    this.resultText = '';

    this.rollStartTime = Date.now();

    const dist = this.camera.position.y;
    const fovRad = (this.camera.fov * Math.PI) / 180;
    const visibleHeight = 2 * Math.tan(fovRad / 2) * dist;
    const aspect = window.innerWidth / window.innerHeight;
    const visibleWidth = visibleHeight * aspect;
    const minDimension = Math.min(visibleWidth, visibleHeight);
    const throwRadius = minDimension * 0.4;
    const throwHeight = 3;

    this.diceObjects.forEach((obj, i) => {
      obj.stopped = false;
      obj.stableCount = 0;
      obj.body.allowSleep = true;
      obj.body.sleepSpeedLimit = 0.08;
      obj.body.sleepTimeLimit = 0.7;

      obj.body.wakeUp();
      
      const angle = Math.random() * Math.PI * 2;

      const startX = Math.cos(angle) * throwRadius;
      const startZ = Math.sin(angle) * throwRadius;

      obj.body.position.set(startX, throwHeight + i * 1.5, startZ);

      const targetX = Math.random() * 4 - 2;
      const targetZ = Math.random() * 4 - 2;

      const velocityX = targetX - startX;
      const velocityZ = targetZ - startZ;

      const distance = Math.sqrt(velocityX * velocityX + velocityZ * velocityZ);

      const speedMultiplier = distance * 2;

      const velX = (velocityX / distance) * speedMultiplier;
      const velZ = (velocityZ / distance) * speedMultiplier;

      obj.body.velocity.set(velX, 10, velZ);
      obj.body.angularVelocity.set(
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
      );

      obj.body.quaternion.setFromEuler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      );

      obj.mesh.position.copy(obj.body.position as any);
      obj.mesh.quaternion.copy(obj.body.quaternion as any);
    });

    this.checkRollingStatus();
  }

  private checkRollingStatus() {
    const checkInterval = setInterval(() => {
      if (Date.now() - this.rollStartTime < 1500) {
        return;
      }

      let allStopped = true;

      this.diceObjects.forEach((obj) => {
        if (obj.stopped) return;

        const isSleeping = obj.body.sleepState === CANNON.Body.SLEEPING;

        const speed = obj.body.velocity.length();
        const angularSpeed = obj.body.angularVelocity.length();
        const isSlow = speed < 0.05 && angularSpeed < 0.05; 

        if (isSleeping || isSlow) {
          obj.stableCount++;
        } else {
          obj.stableCount = 0; 
        }

        if (obj.stableCount > 10) {
          obj.stopped = true;
        } else {
          allStopped = false;
        }
      });

      if (allStopped) {
        if (this.allStoppedSince === null) {
          this.allStoppedSince = Date.now();
          return; 
        }

        if (Date.now() - this.allStoppedSince >= this.finalStableWindowMs) {
          clearInterval(checkInterval);
          requestAnimationFrame(() => this.finishRoll());
        }
      } else {
        this.allStoppedSince = null;
      }
    }, 50);

    setTimeout(() => {
      clearInterval(checkInterval);
      if (this.isRolling) this.finishRoll();
    }, 5000);
  }

  private finishRoll() {
    if (!this.isRolling) return;
    this.isRolling = false;
    const results = this.diceObjects.map((obj) => {
      return this.calculateRealResult(obj);
    });

    let finalRoll = 0;
    let details = '';

    if (this.diceCountModifier === 'adv') {
      const maxVal = Math.max(...results);
      finalRoll = maxVal + this.rollModifier;
      details = `(Adv: [${results.join(', ')}])`;
    } else if (this.diceCountModifier === 'disadv') {
      const minVal = Math.min(...results);
      finalRoll = minVal + this.rollModifier;
      details = `(Disadv: [${results.join(', ')}])`;
    } else {
      const sum = results.reduce((a, b) => a + b, 0);
      finalRoll = sum + this.rollModifier;
      details = `[${results.join(' + ')}]`;
    }

    this.resultText = `${finalRoll} ${details} ${this.rollModifier ? '+ ' + this.rollModifier : ''}`;
    this.rollFinished.emit(finalRoll);
  }


  private calculateRealResult(obj: {
    body: CANNON.Body;
    type: string;
  }): number {
    const body = obj.body;
    const floorVector = new CANNON.Vec3(0, -1, 0);
    let faceNormals: CANNON.Vec3[] = [];

    if (obj.type === 'd6') {
      faceNormals = [
        new CANNON.Vec3(1, 0, 0),
        new CANNON.Vec3(-1, 0, 0),
        new CANNON.Vec3(0, 1, 0),
        new CANNON.Vec3(0, -1, 0),
        new CANNON.Vec3(0, 0, 1),
        new CANNON.Vec3(0, 0, -1),
      ];
    } else {
      const shape = body.shapes[0] as CANNON.ConvexPolyhedron;
      faceNormals = shape.faceNormals;
    }

    let maxDot = -Infinity;
    let bestFaceIndex = -1;
    let bestWorldNormal = new CANNON.Vec3();

    for (let i = 0; i < faceNormals.length; i++) {
      const worldNormal = body.quaternion.vmult(faceNormals[i]);
      const dot = worldNormal.dot(floorVector);

      if (dot > maxDot) {
        maxDot = dot;
        bestFaceIndex = i;
        bestWorldNormal = worldNormal;
      }
    }

    console.log(
      `Kocka: ${obj.type
      }, FÖLDET ÉRŐ index: ${bestFaceIndex}, Egyezés: ${maxDot.toFixed(2)}`,
    );
    return this.getFaceMap(obj.type, bestFaceIndex) > 1 ? this.getFaceMap(obj.type, bestFaceIndex) : 1;
  }

  private getFaceMap(type: string, faceIndex: number): number {
    const maps: { [key: string]: number[] } = {
      d4: [2, 3, 1, 4],
      d6: [1, 6, 2, 5, 3, 4],
      d8: [5, 6, 1, 7, 3, 4, 2, 8],
      d10: [4, 9, 4, 3, 10, 6, 4, 7, 2, 5, 2, 5, 8, 7, 6, 1, 4, 10, 6, 9],
      d12: [
        12, 1, 1, 2, 2, 8, 7, 3, 10, 10, 10, 10, 5, 5, 5, 4, 4, 6, 7, 7, 2, 8, 6,
        8, 1, 9, 1, 3, 3, 6, 11, 11, 11, 9, 12, 9,
      ],
      d20: [
        6, 13, 2, 10, 3, 9, 15, 12, 14, 11, 4, 19, 16, 18, 8, 17, 7, 1, 5, 20,
      ],
    };

    const map = maps[type] || [];
    return map[faceIndex] !== undefined ? map[faceIndex] : faceIndex + 1;
  }

  animate = () => {
    this.animationId = requestAnimationFrame(this.animate);
    const time = performance.now();
    const dt = (time - this.lastTime) / 1000;

    this.lastTime = time;
    const fixedTimeStep = 1 / 60;
    const maxSubSteps = 10;

    const safeDt = Math.min(dt, 0.1);
    this.world.step(fixedTimeStep, safeDt, maxSubSteps);

    this.diceObjects.forEach((obj) => {
      obj.mesh.position.copy(obj.body.position as any);
      obj.mesh.quaternion.copy(obj.body.quaternion as any);
    });

    if (this.cannonDebugger) {
      this.cannonDebugger.update();
    }

    this.renderer.render(this.scene, this.camera);
  };

  reset() {
    this.resultText = '';
    this.throwDice();
  }

  close() {
    this.closeEvent.emit();
  }
}
