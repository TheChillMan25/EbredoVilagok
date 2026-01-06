import { Component, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CanComponentDeactivate } from '../../creator/karakter/karakter.component';
import {
  PlayerRole,
  GameService,
  checkRole,
} from '../../../shared/services/game/game.service';
import {
  AdventureEvent,
  Character,
  Game,
  Player,
} from '../../../shared/models/models';
import { Subscription, take } from 'rxjs';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { MapContainerComponent } from '../../../shared/functional/map-container/map-container.component';
import { NgClass } from '@angular/common';
import {
  getHome,
  getSpeciesSpecial,
  setBackground,
} from '../../../shared/functional/functions';
import {
  getLocationByName,
  Location,
} from '../../../shared/models/map_locations';
import { ItemComponent } from '../templates/item/item.component';
import {
  Food,
  Item,
  SpecialItem,
} from '../../../shared/models/game_interfaces';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { Armour, Weapon } from '../../../shared/models/game_interfaces';
import { ItemService } from '../../../shared/services/item/item.service';

@Component({
  selector: 'app-game-area',
  imports: [MapContainerComponent, ItemComponent, NgClass, MatIcon, MatTooltip],
  templateUrl: './game-area.component.html',
  styleUrl: './game-area.component.scss',
})
export class GameAreaComponent implements CanComponentDeactivate {
  @ViewChild('map') map!: MapContainerComponent;
  activeInventory: 'f' | 's' | 'g' = 'g';
  currentInventory: any[] = [];
  selectedItem: Food | SpecialItem | Item | null = null;

  gameId!: string;
  game!: Game | undefined | null;
  player!: Player | undefined | null;
  myCharacterSpecs?: {
    speciesSpecial: { desc: string };
    home: { desc: string; bonus: { name: string; mod: string }[] };
    equipment: {
      left: Weapon;
      right: Weapon;
      armour: Armour;
    };
  };

  hasHostileNPC = false;
  currentEventIdx!: number;
  currentEvent?: AdventureEvent;
  myTurn = false;

  private _currentUserId!: string;
  set currentUserId(value: string) {
    this._currentUserId = value;
  }
  get currentUserId() {
    return this._currentUserId;
  }
  private _role!: PlayerRole;
  set role(value: PlayerRole) {
    this._role = value;
  }
  get role() {
    return this._role;
  }

  PlayerRole = PlayerRole;

  dontWarnLeaving = false;

  gameSub!: Subscription;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private gameService: GameService,
    private router: Router,
    private itemService: ItemService
  ) {}

  async ngOnInit() {
    setBackground('#222', true);
    await this.itemService.initItems();
    this.gameId = this.route.snapshot.paramMap.get('id')!;
    this.authService.currentUser.pipe(take(1)).subscribe((user) => {
      this.currentUserId = user!.uid;
      this.role = checkRole(this.currentUserId, this.gameId);
    });
    this.loadData();
  }

  ngOnDestroy() {
    if (this.gameSub) this.gameSub.unsubscribe();
  }

  canDeactivate(): Promise<boolean> | boolean {
    return true;
  }

  @HostListener('window:beforeunload', ['$event'])
  async unloadNotification($event: any) {
    //$event.returnValue = true;
  }

  loadData() {
    this.gameSub = this.gameService.getGame(this.gameId).subscribe((game) => {
      this.game = game;
      this.currentEventIdx = game.currentEvent;
      this.setCurrentEvent();
      if (this.role === PlayerRole.PLAYER) {
        this.player = this.game.players.find(
          (p) => p.userId === this.currentUserId
        )!;
        this.setUpCharacterSpecs(this.player.character!);
        this.selectInventory();
        this.myTurn = this.player.userId === game.currentPlayer;
      }
      if (!this.game.started) {
        this.dontWarnLeaving = true;
        this.router.navigate(['jatek/', this.gameId]);
      } else if (
        !this.game.players.find((p) => p.userId === this.currentUserId) &&
        this.role === PlayerRole.PLAYER
      ) {
        this.dontWarnLeaving = true;
        //this.leaveGame();
      }
    });
  }

  setUpCharacterSpecs(character: Character) {
    this.myCharacterSpecs = {
      speciesSpecial: getSpeciesSpecial(
        character.species,
        character.specialProperties.speciesProperty
      ),
      home: getHome(character.species, character.specialProperties.home),
      equipment: {
        left: this.itemService.getItem('weapons', character.equipment.left),
        right: this.itemService.getItem('weapons', character.equipment.right),
        armour: this.itemService.getItem('armours', character.equipment.armour),
      },
    };
  }

  locateCurrentEventLocation() {
    const loc: Location | null = getLocationByName(
      this.currentEvent?.location!
    );
    if (loc && this.map) this.map.locatePoint(loc, false);
  }

  setCurrentEvent() {
    this.currentEvent = this.game?.adventure?.events[this.currentEventIdx];
    this.hasHostileNPC =
      this.currentEvent?.NPCs.some((npc) => npc.attitude === 'hostile') ||
      false;
    const loc: Location | null = getLocationByName(
      this.currentEvent?.location!
    );
    if (loc && this.map) this.map.locatePoint(loc, false);
  }

  selectInventory(invenotry: 'f' | 'g' | 's' = this.activeInventory) {
    this.activeInventory = invenotry;
    switch (this.activeInventory) {
      case 'f':
        if (this.currentInventory.length !== 0) this.currentInventory = [];
        this.player?.character?.items.food.forEach((f) => {
          this.currentInventory.push(this.itemService.getItem('food', f));
        });
        break;
      case 'g':
        if (this.currentInventory.length !== 0) this.currentInventory = [];
        this.player?.character?.items.generalItems.forEach((f) => {
          this.currentInventory.push(
            this.itemService.getItem('generalItems', f)
          );
        });
        break;
      case 's':
        if (this.currentInventory.length !== 0) this.currentInventory = [];
        this.player?.character?.items.specialItems.forEach((f) => {
          this.currentInventory.push(
            this.itemService.getItem('specialItems', f)
          );
        });
        break;
    }
  }

  selectItem(idx: number) {
    if (idx === this.currentInventory.indexOf(this.selectedItem)) {
      this.selectedItem = null;
      return;
    }
    this.selectedItem = this.currentInventory[idx];
  }
}
