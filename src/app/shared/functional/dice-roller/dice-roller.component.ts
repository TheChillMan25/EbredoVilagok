import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

@Component({
  selector: 'app-dice-roller',
  imports: [],
  templateUrl: './dice-roller.component.html',
  styleUrl: './dice-roller.component.scss',
})
export class DiceRollerComponent {
  @ViewChild('canvasContainer') canvasContainer!: ElementRef;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private diceMesh!: THREE.Group;
  private textrureLoader!: THREE.TextureLoader;
  private gltfLoader: GLTFLoader = new GLTFLoader();

  private world!: CANNON.World;
  private diceBody!: CANNON.Body;
  private groundBody!: CANNON.Body;

  private animationFrameID?: number;

  constructor() {}

  ngAfterViewInit() {
    this.initScene();
    this.initPhysics();
    this.createGround();
  }

  ngOnDestroy() {}

  private initScene(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xeeeeee);

    const container = this.canvasContainer.nativeElement;
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.01, 1000);
    this.camera.position.set(0, 10, 0);
    this.camera.lookAt(0, 0, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight();
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);
  }

  private initPhysics(): void {
    this.world = new CANNON.World();
    this.world.gravity.set(0, -9.82, 0);
  }

  private createGround(): void {
    this.groundBody = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Plane(),
    });

    this.groundBody.quaternion.setFromEuler(Math.PI / 2, 0, 0);
    this.world.addBody(this.groundBody);

    const groundGeometry = new THREE.PlaneGeometry();
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x558855,
      /* transparent: true,
      opacity: 0, */
    });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    this.scene.add(groundMesh);
    console.log(this.scene);
  }

  rollDice(type: 'd4' | 'd6' | 'd10' | 'd20' | 'd100') {
    console.log(type);
  }
}
