import { Component, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CanComponentDeactivate } from '../../creator/karakter/karakter.component';
import {
  PlayerRole,
  GameService,
  checkRole,
} from '../../../shared/services/game/game.service';
import {
  ActionType,
  AdventureEvent,
  Character,
  Game,
  GameAction,
  NPC,
  Player,
} from '../../../shared/models/models';
import { Subscription, take } from 'rxjs';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { MapContainerComponent } from '../../../shared/functional/map-container/map-container.component';
import { NgClass } from '@angular/common';
import {
  getEffectDetails,
  getHome,
  getSpeciesSpecial,
  getStatDetails,
  getStatusDetails,
  setBackground,
} from '../../../shared/functional/functions';
import {
  getLocationByName,
  Location,
} from '../../../shared/models/map_locations';
import { ItemComponent } from '../templates/item/item.component';
import { PlayerNpcComponent } from '../templates/player-npc/player-npc.component';
import {
  ActiveStatus,
  EffectType,
  Food,
  GameErrorCauses,
  Inventory,
  Item,
  ItemCategory,
  ItemEffect,
  ItemSize,
  ItemType,
  SpecialItem,
  StatusType,
} from '../../../shared/models/game_interfaces';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { Armour, Weapon } from '../../../shared/models/game_interfaces';
import { ItemService } from '../../../shared/services/item/item.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatFormFieldModule,
  MatLabel,
  MatError,
} from '@angular/material/form-field';
import { MatSelect, MatOption, MatOptgroup } from '@angular/material/select';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { noWhitespaceValidator } from '../../forum/post-template/post-template.component';
import { DiceRollerComponent } from '../../../shared/functional/dice-roller/dice-roller.component';

@Component({
  selector: 'app-game-area',
  imports: [
    MapContainerComponent,
    ItemComponent,
    NgClass,
    MatIcon,
    MatTooltip,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSelect,
    ɵInternalFormsSharedModule,
    PlayerNpcComponent,
    MatInputModule,
    MatLabel,
    MatOption,
    MatOptgroup,
    ReactiveFormsModule,
    MatCheckbox,
    MatError,
    MatButtonModule,
    MatProgressSpinnerModule,
    DiceRollerComponent,
  ],
  templateUrl: './game-area.component.html',
  styleUrl: './game-area.component.scss',
})
export class GameAreaComponent implements CanComponentDeactivate {
  isLoading = false;
  @ViewChild('map') map!: MapContainerComponent;
  @ViewChild('isPartyWideCheckbox') isPartyWideCheckbox!: MatCheckbox;
  @ViewChild('isPrimaryCheckbox') isPrimaryCheckbox!: MatCheckbox;
  snackBar = new MatSnackBar();
  isNewRound = false;
  actionForm!: FormGroup;
  addStatusForm!: FormGroup;
  addItemForm!: FormGroup;
  newItemEffectForm!: FormGroup;
  fb = new FormBuilder();
  isPerformingAction = false;
  actionPanelVisible = false;
  actionError = '';
  addStatusPanelVisible = false;
  isLoadingStatus = false;
  addItemPanelVisible = false;
  isLoadingItem = false;
  hasStatusValue = false;
  addStatusError = '';
  addItemError = '';
  addItemEffectError = '';

  activeInventory: 'f' | 's' | 'g' | 'e' = 's';
  currentInventory: (Food | SpecialItem | Item | Inventory)[] = [];
  selectedItemIdx?: number;
  selectedItem?: Food | SpecialItem | Item | null = null;
  selectedTarget?: Player | NPC | null = null;
  performedActions = {
    primary: {} as GameAction,
    secondary: {} as GameAction,
  };

  currentPlayer?: Player;
  firtsEvent = true;
  lastEvent = false;
  isInspectingNPC = false;
  selectedNPC?: NPC | null = null;
  selectedPlayerStatus?: ActiveStatus | null = null;
  newItemEffects: ItemEffect[] = [];
  effectHasDuration = false;
  effectHasValue = false;

  gameId?: string;
  game?: Game | null;
  player?: Player | NPC | null;
  myCharacterSpecs?: {
    speciesSpecial: { desc: string };
    home: { desc: string; bonus: { name: string; mod: string }[] };
    equipment: {
      left: Weapon;
      right: Weapon;
      armour: Armour;
    };
    items: {
      food: Food[];
      specialItems: SpecialItem[];
      generalItems: (Item | Inventory)[];
      equipmentItems: (Weapon | Armour)[];
    };
  };
  itemTypeLabels: Record<string, string> = {
    FOOD: 'Ételek',
    COMMON: 'Általános',
    MEDICAL: 'Gyógyszerek',
    SPECIAL: 'Különleges',
  };
  get groupedItems(): { label: string; items: any[] }[] {
    const items = this.myCharacterSpecs?.items || [];
    const groups: Record<string, any[]> = {};
    Object.values(items).forEach((arr) => {
      arr.forEach((item) => {
        const type = item.type || 'EGYEB';
        if (!groups[type]) {
          groups[type] = [];
        }
        groups[type].push(item);
      });
    });
    return Object.keys(groups).map((key) => ({
      label: this.itemTypeLabels[key] || key,
      items: groups[key],
    }));
  }

  hasHostileNPC = false;
  onlyHostileNPC = false;
  currentEventIdx!: number;
  currentEvent?: AdventureEvent;
  myTurn = false;
  readyToPerformAction = false;

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
  ActionType = ActionType;
  ActionTypes = [
    { value: ActionType.USEITEM, viewValue: 'Tárgy használata' },
    { value: ActionType.CAMP, viewValue: 'Táborozás' },
    { value: ActionType.TALK, viewValue: 'Beszéd' },
    { value: ActionType.TRADE, viewValue: 'Kereskedés' },
    { value: ActionType.ATTACK, viewValue: 'Támadás' },
    { value: ActionType.STEAL, viewValue: 'Lopás' },
  ];
  StatusTypes = [
    { value: StatusType.BLEED },
    { value: StatusType.POISON },
    { value: StatusType.BURN },
    { value: StatusType.PROSTHETIC },
    { value: StatusType.ADVANTAGE },
    { value: StatusType.DISADVANTAGE },
    { value: StatusType.FIRE_RES },
    { value: StatusType.POISON_RES },
    { value: StatusType.STRESS_RES },
    { value: StatusType.ANIMAL_TOUNGE },
    { value: StatusType.FREE_MAGIC },
    { value: StatusType.FULL_BELLY },
    { value: StatusType.SLEEP },
  ];
  ItemTypes = [
    { value: ItemType.COMMON, name: 'Általános', icon: 'category' },
    { value: ItemType.FOOD, name: 'Étel', icon: 'beer_meal' },
    { value: ItemType.MEDICAL, name: 'Gyógyszer', icon: 'health_cross' },
    { value: ItemType.SPECIAL, name: 'Különleges', icon: 'science' },
  ];
  ItemCategories = [
    { value: ItemCategory.GENERAL, name: 'Általános', icon: 'category' },
    {
      value: ItemCategory.CONSUMABLE,
      name: 'Felhasználható',
      icon: 'auto_fix_high',
    },
  ];
  Stats = [
    { value: 'str', name: 'Erő', icon: 'fitness_center' },
    { value: 'dex', name: 'Ügyesség', icon: 'sports_martial_arts' },
    { value: 'end', name: 'Kitartás', icon: 'directions_run' },
    { value: 'int', name: 'Ész', icon: 'auto_stories' },
    { value: 'cun', name: 'Fortély', icon: 'psychology' },
    { value: 'wil', name: 'Akaraterő', icon: 'diamond' },
  ];
  EffectTypes = [
    { value: EffectType.HEAL_HP, name: 'HP gyógyítás', icon: 'health_metrics' },
    { value: EffectType.HEAL_SP, name: 'SP gyógyítás', icon: 'mindfulness' },
    {
      value: EffectType.HEAL_SMALL_WOUND,
      name: 'Kis seb gyógyítás',
      icon: 'healing',
    },
    {
      value: EffectType.HEAL_LARGE_WOUND,
      name: 'Nagy seb gyógyítás',
      icon: 'femur',
    },
    { value: EffectType.BUFF_STAT, name: 'Stat erősítés', icon: 'trending_up' },
    { value: EffectType.ADD_STATUS, name: 'Státusz adás', icon: 'add' },
    {
      value: EffectType.REMOVE_STATUS,
      name: 'Státusz evlétel',
      icon: 'remove',
    },
  ];

  showDiceRoller = false;
  diceToRoll: string[] = ['d20'];

  allItems: any[] = [];

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
    this.initForm();
    await this.itemService.initItems();
    this.allItems = this.itemService.getAllItems();
    this.gameId = this.route.snapshot.paramMap.get('id')!;
    this.authService.currentUser.pipe(take(1)).subscribe((user) => {
      this.currentUserId = user!.uid;
    });
    this.loadData();
  }

  ngOnDestroy() {
    if (this.gameSub) this.gameSub.unsubscribe();
  }

  async canDeactivate(): Promise<boolean> {
    if (this.dontWarnLeaving) return true;
    if (confirm('Biztosan kilépsz a játékból?')) {
      await this.leaveGame();
      return true;
    }
    return false;
  }

  @HostListener('window:beforeunload', ['$event'])
  async unloadNotification($event: any) {
    //$event.returnValue = true;
  }

  /* GENERAL FUNCTIONS */
  initForm() {
    this.actionForm = this.fb.group({
      type: ['', [Validators.required]],
      isPrimary: [false],
      isPartyWide: [false],
      item: [''],
    });
    this.addStatusForm = this.fb.group({
      type: ['', [Validators.required]],
      duration: [
        1,
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
      value: [1, [Validators.min(1), Validators.max(1000)]],
    });
    this.addItemForm = this.fb.group({
      existingItem: [''],
      newItemName: [
        '',
        [
          noWhitespaceValidator,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      newItemType: [ItemType.COMMON],
      newItemCategory: [ItemCategory.GENERAL],
      newItemEffectDesc: [
        '',
        [
          noWhitespaceValidator,
          Validators.minLength(0),
          Validators.maxLength(200),
        ],
      ],
      newItemUses: [1, [Validators.min(1), Validators.max(100)]],
      newItemDesc: [
        '',
        [
          noWhitespaceValidator,
          Validators.minLength(0),
          Validators.maxLength(200),
        ],
      ],
      hasEffect: [{ value: false, disabled: true }],
    });
    this.newItemEffectForm = this.fb.group({
      type: [],
      duration: [1, [Validators.min(1), Validators.max(100)]],
      stat: [],
      status: [],
      value: [1, [Validators.min(1), Validators.max(1000)]],
      target: [],
    });
    this.actionForm.get('item')?.valueChanges.subscribe((value) => {
      if (value !== '') {
        let item: any;
        Object.values(this.myCharacterSpecs?.items!).forEach((arr) => {
          if (arr.some((i) => i.id === value)) {
            item = arr.find((i) => i.id === value);
          }
        });
        if (!item) return;
        if (!this.itemCheck(item)) {
          this.actionForm.patchValue({ item: '' });
        }
        const isPartyWide = this.actionForm.get('isPartyWide');
        isPartyWide?.patchValue(
          'isPartyWide' in item ? item.isPartyWide : false
        );
        this.isPartyWideCheckbox.disabled = true;
        this.selectedItem = item;
      }
    });
    this.actionForm.get('type')?.valueChanges.subscribe((value) => {
      const isPrimary = this.actionForm.get('isPrimary');
      const isPartyWide = this.actionForm.get('isPartyWide');
      switch (value) {
        case ActionType.CAMP:
          isPartyWide?.patchValue(true);
          this.isPartyWideCheckbox.disabled = true;
          this.isPrimaryCheckbox.disabled = true;
          isPrimary?.patchValue(true);
          this.resetSelectedItem();
          break;
        case ActionType.USEITEM:
          if (this.player?.actionsLeft.secondary === false) {
            isPrimary?.patchValue(true);
            this.isPrimaryCheckbox.disabled = false;
          } else {
            isPrimary?.patchValue(false);
            this.isPrimaryCheckbox.disabled = false;
          }
          this.isPartyWideCheckbox.disabled = true;
          isPartyWide?.patchValue(false);
          break;
        default:
          this.isPartyWideCheckbox.disabled = true;
          isPartyWide?.patchValue(false);
          this.isPrimaryCheckbox.disabled = true;
          isPrimary?.patchValue(true);
          this.resetSelectedItem();
          break;
      }
    });
    this.addStatusForm.get('type')?.valueChanges.subscribe((value) => {
      if (
        [StatusType.BLEED, StatusType.POISON, StatusType.BURN].includes(value)
      )
        this.hasStatusValue = true;
      else this.hasStatusValue = false;
    });
    this.addItemForm.get('newItemType')?.valueChanges.subscribe((value) => {
      const effectControl = this.addItemForm.get('hasEffect');
      if (value === ItemType.COMMON) {
        effectControl?.patchValue(false);
        effectControl?.disable();
      } else {
        effectControl?.enable();
      }
    });
    this.addItemForm.get('newItemCategory')?.valueChanges.subscribe((value) => {
      const effectControl = this.addItemForm.get('hasEffect');
      if (value === ItemCategory.CONSUMABLE) {
        effectControl?.enable();
      } else {
        effectControl?.patchValue(false);
        effectControl?.disable();
      }
    });
    this.newItemEffectForm
      .get('type')
      ?.valueChanges.subscribe((value: EffectType) => {
        if (
          [
            EffectType.ADD_STATUS,
            EffectType.REMOVE_STATUS,
            EffectType.BUFF_STAT,
          ].includes(value)
        ) {
          this.effectHasDuration = true;
          if (
            [StatusType.BLEED, StatusType.POISON, StatusType.BURN].includes(
              this.newItemEffectForm.get('status')?.value
            ) &&
            value === EffectType.ADD_STATUS
          )
            this.effectHasValue = true;
          else this.effectHasValue = false;
        } else {
          this.effectHasDuration = false;
          this.effectHasValue = true;
        }
      });
    this.newItemEffectForm.get('status')?.valueChanges.subscribe((value) => {
      if (
        [StatusType.BLEED, StatusType.POISON, StatusType.BURN].includes(
          value
        ) &&
        this.newItemEffectForm.get('type')?.value === EffectType.ADD_STATUS
      ) {
        this.effectHasValue = true;
      } else {
        this.effectHasValue = false;
      }
    });
  }

  loadData() {
    this.gameSub = this.gameService.getGame(this.gameId!).subscribe((game) => {
      if (!game) {
        this.dontWarnLeaving = true;
        this.router.navigateByUrl('/jatek');
        return;
      }

      this.game = game;
      if (
        game.initiatives.every((i) => i.finished === false) &&
        this.isNewRound
      ) {
        this.openSnackBar('Új kör következik!');
        this.isNewRound = false;
      }
      game.players.sort(
        (a: Player, b: Player) => b.initiative! - a.initiative!
      );

      if (!this.game.started) {
        this.dontWarnLeaving = true;
        this.router.navigateByUrl('/jatek');
        return;
      }
      this.role = checkRole(this.currentUserId, this.game.ownerId);
      this.currentEventIdx = game.currentEvent;
      this.setCurrentEvent();

      if (this.role === PlayerRole.PLAYER) {
        const foundPlayer = this.game.players.find(
          (p) => p.id === this.currentUserId
        );

        if (!foundPlayer) {
          this.dontWarnLeaving = true;
          this.router.navigateByUrl('/jatek');
          return;
        }

        this.player = foundPlayer;
        if (this.player.character) {
          this.setUpCharacterSpecs(this.player.character);
        }
        this.myTurn = this.player.id === game.currentPlayer;
      } else {
        this.myTurn =
          this.currentEvent?.NPCs.some((n) => n.id === game.currentPlayer) ||
          false;
        this.currentPlayer = game.players.find(
          (p) => p.id === game.currentPlayer
        );

        this.setUpCharacterSpecs(this.currentPlayer?.character!);
        this.game.currentAction = {
          performer: {
            id: this.currentPlayer?.id ?? '',
            name: this.currentPlayer?.name ?? '',
          },
          primary: this.currentPlayer?.lastAction.primary ?? ({} as GameAction),
          secondary:
            this.currentPlayer?.lastAction.secondary ?? ({} as GameAction),
        };
      }
      if (!this.myTurn) {
        this.resetSelectedItem();
        this.selectedTarget = null;
        this.selectedNPC = null;
      }
    });
  }

  openDiceRoller(dice: string[] = ['d20']) {
    this.diceToRoll = dice;
    this.showDiceRoller = true;
  }

  onDiceRollFinished(results: number[]) {
    const sum = results.reduce((a, b) => a + b, 0);
    const details = results.join(' + ');
    this.openSnackBar(`Dobás eredménye: ${sum} (${details})`);

    console.log('Dobott értékek:', results);
  }

  closeDiceRoller() {
    this.showDiceRoller = false;
  }

  resetSelectedItem() {
    this.selectedItem = null;
    this.selectedItemIdx = undefined;
    this.actionForm.get('item')?.patchValue('');
  }

  setUpCharacterSpecs(character: Character) {
    this.myCharacterSpecs = {
      speciesSpecial: getSpeciesSpecial(
        character.species,
        character.specialProperties.speciesProperty
      ),
      home: getHome(character.species, character.specialProperties.home),
      equipment: {
        left: character.equipment.left,
        right: character.equipment.right,
        armour: character.equipment.armour,
      },
      items: {
        food: [],
        specialItems: [],
        generalItems: [],
        equipmentItems: [],
      },
    };
    this.myCharacterSpecs.items = {
      food: character.items.food,
      specialItems: character.items.specialItems,
      generalItems: character.items.generalItems,
      equipmentItems: character.items.equipmentItems,
    };
    this.selectInventory();
  }

  locateCurrentEventLocation() {
    const loc: Location | null = getLocationByName(
      this.currentEvent?.location!
    );
    if (loc && this.map) this.map.locatePoint(loc, false);
  }

  setCurrentEvent() {
    if (this.currentEventIdx === 0) this.firtsEvent = true;
    if (this.currentEventIdx === this.game?.adventure?.events?.length! - 1)
      this.lastEvent = true;
    if (
      this.currentEventIdx > 0 &&
      this.currentEventIdx < this.game?.adventure?.events?.length! - 1
    ) {
      this.firtsEvent = false;
      this.lastEvent = false;
    }
    this.currentEvent = this.game?.adventure?.events[this.currentEventIdx];
    this.hasHostileNPC =
      (this.currentEvent?.NPCs.some((npc) => npc.attitude === 'hostile') &&
        this.currentEvent.NPCs.length > 0) ||
      false;
    this.onlyHostileNPC =
      (this.currentEvent?.NPCs.every((npc) => npc.attitude === 'hostile') &&
        this.currentEvent.NPCs.length > 0) ||
      false;
    const loc: Location | null = getLocationByName(
      this.currentEvent?.location!
    );
    if (loc && this.map) this.map.locatePoint(loc, false);
  }

  showActionPanel(
    event: MouseEvent,
    action?: ActionType,
    show: boolean = true
  ) {
    const target = event.target as HTMLElement;
    if (target.id !== 'actionUI' && !show) return;
    if (show) {
      this.actionForm.get('type')?.patchValue(action);
      if (this.selectedItem) {
        this.actionForm.patchValue({
          item: this.selectedItem.id,
        });
      }
      if (this.selectedTarget) {
        this.actionForm.patchValue({
          target: this.selectedTarget.name,
        });
      }
    }
    this.actionPanelVisible = show;
  }
  showPanel(type: 'status' | 'item', event: MouseEvent, show: boolean = true) {
    const target = event.target as HTMLElement;
    if (type === 'status') {
      if (target.id !== 'addStatusUI' && !show) return;
      this.addStatusPanelVisible = show;
    } else if (type === 'item') {
      if (target.id !== 'addItemUI' && !show) return;
      this.addItemPanelVisible = show;
    }
  }

  openSnackBar(msg: string) {
    this.snackBar.open(msg, '', { duration: 2500 });
  }

  getActionName(type: ActionType) {
    switch (type) {
      case ActionType.USEITEM:
        return 'Tárgy használat';
      case ActionType.CAMP:
        return 'Táborozás';
      case ActionType.TALK:
        return 'Beszéd';
      case ActionType.TRADE:
        return 'Kereskedés';
      case ActionType.ATTACK:
        return 'Támadás';
      case ActionType.STEAL:
        return 'Lopás';
      default:
        return '';
    }
  }

  getEffectDetails(effectType: EffectType) {
    return getEffectDetails(effectType);
  }

  getStatusDetails(statusType: StatusType) {
    return getStatusDetails(statusType);
  }

  getStatDetails(stat: string) {
    return getStatDetails(stat);
  }

  /* GAME UI FUNCTIONS */
  selectInventory(invenotry: 'f' | 'g' | 's' | 'e' = this.activeInventory) {
    this.resetSelectedItem();
    this.activeInventory = invenotry;
    switch (this.activeInventory) {
      case 'f':
        if (this.currentInventory.length !== 0) this.currentInventory = [];
        this.currentInventory = this.myCharacterSpecs?.items.food!;
        break;
      case 's':
        if (this.currentInventory.length !== 0) this.currentInventory = [];
        this.currentInventory = this.myCharacterSpecs?.items.specialItems!;
        break;
      case 'g':
        if (this.currentInventory.length !== 0) this.currentInventory = [];
        this.currentInventory = this.myCharacterSpecs?.items.generalItems!;
        break;
      case 'e':
        this.currentInventory = this.myCharacterSpecs?.items.equipmentItems!;
        break;
    }
  }

  controlSelection(type: 'item' | 'character', id: number | string) {
    switch (type) {
      case 'item':
        this.selectItem(id as number);
        break;
      case 'character':
        if (this.role === PlayerRole.HOST) {
          this.select(id as string);
        } else {
          this.selectTarget(id as string);
        }
    }
  }

  noactionsLeft(): boolean {
    return (
      !this.player?.actionsLeft.primary && !this.player?.actionsLeft.secondary
    );
  }

  itemCheck(item: any): boolean {
    if (
      this.player?.inCombat &&
      (!('combat' in item) || item.combat === false)
    ) {
      this.openSnackBar('Ezt a tárgyat nem használhatod harc közben!');
      return false;
    }
    return true;
  }

  selectItem(idx: number) {
    if (!this.myTurn) {
      this.openSnackBar('Csak a te körödben csinálhatod!');
      return;
    }
    if (this.noactionsLeft()) {
      this.openSnackBar('Elfogytak az akcióid!');
      return;
    }
    if (this.selectedItemIdx === idx) {
      this.resetSelectedItem();
      return;
    }
    const item = this.currentInventory[idx];
    if (this.itemCheck(item)) {
      this.selectedItemIdx = idx;
      this.selectedItem = item;
      console.log(this.selectedItem);
      this.actionForm.get('type')?.patchValue(ActionType.USEITEM);
      this.openSnackBar(`Tárgy kiválasztva: ${this.selectedItem?.name}`);
    }
  }

  selectTarget(target: string) {
    if (!this.myTurn) {
      this.openSnackBar('Ezt csak a te körödben csinálhatod!');
      return;
    }
    const newTarget =
      this.game?.players.find((p) => p.id === target) ??
      this.currentEvent?.NPCs.find((n) => n.id === target) ??
      null;
    if (!newTarget) {
      this.openSnackBar('Érvénytelen célpont!');
      return;
    }

    if (target === this.selectedTarget?.id) {
      this.selectedTarget = null;
      this.actionForm.get('target')?.patchValue('');
      return;
    }

    this.selectedTarget = newTarget;
    this.openSnackBar(`Célpont kiválasztva: ${this.selectedTarget.name}`);
  }

  select(id: string) {
    if (this.role !== PlayerRole.HOST) {
      this.openSnackBar('Ehhez nincs jogosultságod!');
      return;
    }
    if (this.player?.id === id) {
      this.player = null;
      return;
    }
    this.player = this.currentEvent?.NPCs.find((n) => n.id === id);
    if (this.player) {
      this.setUpCharacterSpecs(this.player?.character!);
      this.openSnackBar(`NPC kiválasztva: ${this.player?.name}`);
    } else {
      this.currentPlayer = this.game?.players.find((p) => p.id === id);
      this.setUpCharacterSpecs(this.currentPlayer?.character!);
      this.openSnackBar(`Játékos kiválasztva: ${this.currentPlayer?.name}`);
    }
  }

  selectPlayerStatus(status: ActiveStatus) {
    if (this.role !== PlayerRole.HOST) {
      this.openSnackBar('Ehhez nincs jogosultságod!');
      return;
    }
    this.selectedPlayerStatus =
      status.type !== this.selectedPlayerStatus?.type ? status : null;
  }

  async removeStatusFromPlayer() {
    try {
      this.isLoadingStatus = true;
      if (!this.selectedPlayerStatus) {
        this.openSnackBar('Válassz ki egy hatást a játékoson!');
        return;
      }
      const statusName = this.getStatusDetails(
        this.selectedPlayerStatus?.type!
      ).name;
      let idx = this.currentPlayer?.character?.activeStatuses.findIndex(
        (s) => s.type === this.selectedPlayerStatus?.type
      );
      if (idx === undefined || idx === -1) {
        this.openSnackBar('Nincs ilyen hatás a játékoson!');
        return;
      }
      this.currentPlayer?.character?.activeStatuses.splice(idx, 1);
      await this.gameService.updateGame(this.gameId!, {
        players: this.game?.players,
      });
      this.openSnackBar(
        'Hatás sikeresen eltávolítva a játékosról: ' + statusName
      );
      this.isLoadingStatus = false;
    } catch (error) {
      this.isLoadingStatus = false;
      console.error('Hiba a hatás eltávolításakor: ', error);
      this.openSnackBar(
        'Hiba a hatás eltávolításakor! További információ a konzolon.'
      );
      return;
    }
  }
  async addStatusToPlayer() {
    try {
      if (this.addStatusForm.invalid) {
        this.addStatusError = 'Töltsd ki a kötelező ezőket!';
        return;
      }
      const statusValue = this.addStatusForm.value;
      const isValueType = [
        StatusType.BLEED,
        StatusType.POISON,
        StatusType.BURN,
      ].includes(statusValue.type);
      if ((isValueType && !statusValue.value) || statusValue.value === 0) {
        this.addStatusForm.get('value')?.setErrors({ required: true });
        this.addStatusError = 'Adj meg egy érvényes értéket!';
        return;
      }
      this.isLoadingStatus = true;
      const statusName = getStatusDetails(statusValue.type).name;
      let newStatus: ActiveStatus = {
        type: statusValue.type,
        duration: statusValue.duration,
      };
      if (
        this.currentPlayer?.character?.activeStatuses.some(
          (s) => s.type === newStatus.type
        )
      ) {
        this.addStatusError = 'Már van ilyen hatás a játékoson!';
        this.isLoadingStatus = false;
        return;
      }
      if (isValueType) {
        newStatus.value = statusValue.value;
      }
      this.currentPlayer?.character?.activeStatuses.push(newStatus);
      await this.gameService.updateGame(this.gameId!, {
        players: this.game?.players,
      });
      this.openSnackBar(`Hatás sikeresen hozzáadva: ${statusName}`);
      this.addStatusPanelVisible = false;
      this.addStatusForm.reset({
        type: StatusType.BLEED,
        duration: 1,
        value: 1,
      });
      this.isLoadingStatus = false;
    } catch (error) {
      this.isLoadingStatus = false;
      this.addStatusPanelVisible = true;
      console.error('Hiba a státusz hozzáadásakor: ', error);
      this.openSnackBar(
        'Hiba a státus hozzáadásakor! További információ a konzolon.'
      );
      return;
    }
  }

  addEffectToNewItem() {
    const effectValue = this.newItemEffectForm.value;
    if (!effectValue.type) {
      this.newItemEffectForm.get('type')?.setErrors({ required: true });
      this.addItemEffectError = 'Válassz egy hatást!';
      return;
    }
    let newEffect: ItemEffect = {
      type: effectValue.type,
    };
    if (
      [
        EffectType.ADD_STATUS,
        EffectType.REMOVE_STATUS,
        EffectType.BUFF_STAT,
      ].includes(effectValue.type)
    ) {
      if (!effectValue.duration) {
        this.newItemEffectForm.get('duration')?.setErrors({ required: true });
        this.addItemEffectError = 'Állíts be időtartamot!';
        return;
      }
      newEffect.duration = effectValue.duration;
      if (effectValue.type === EffectType.BUFF_STAT) {
        if (!effectValue.stat) {
          this.newItemEffectForm.get('stat')?.setErrors({ required: true });
          this.addItemEffectError = 'Válassz egy statot!';
          return;
        }
        newEffect.stat = effectValue.stat;
      } else {
        if (!effectValue.status) {
          this.newItemEffectForm.get('status')?.setErrors({ required: true });
          this.addItemEffectError = 'Válassz egy státuszt!';
          return;
        } else if (
          effectValue.type === EffectType.ADD_STATUS &&
          !effectValue.value
        ) {
          this.newItemEffectForm.get('value')?.setErrors({ required: true });
          if (effectValue.value === 0)
            this.addItemEffectError = 'Adj meg egy nagyobb értéket!';
          else this.addItemEffectError = 'Adj meg egy értéket!';
          return;
        }
        newEffect.status = effectValue.status;
      }
    } else if (
      [
        EffectType.HEAL_HP,
        EffectType.HEAL_SP,
        EffectType.HEAL_SMALL_WOUND,
        EffectType.HEAL_LARGE_WOUND,
      ].includes(effectValue.type)
    ) {
      if (!effectValue.value) {
        this.newItemEffectForm.get('value')?.setErrors({ required: true });
        if (effectValue.value === 0)
          this.addItemEffectError = 'Adj meg egy nagyobb értéket!';
        else this.addItemEffectError = 'Adj meg egy értéket!';
        return;
      }
      newEffect.value = effectValue.value;
    }
    if (this.newItemEffects.some((e) => e.type === effectValue.type)) {
      const existingEffect = this.newItemEffects.find(
        (e) => e.type === newEffect.type
      );
      if (
        existingEffect?.stat !== newEffect.stat ||
        existingEffect?.status !== newEffect.status
      ) {
        this.addItemEffectError = '';
        this.newItemEffectForm.reset({
          duration: 1,
          value: 1,
        });
        this.newItemEffects.push(newEffect);
      }
      this.addItemEffectError =
        'Ilyen hatást már eredményez a tárgy. Válassz másikat!';
      return;
    }
    this.addItemEffectError = '';
    this.newItemEffectForm.reset({
      duration: 1,
      value: 1,
    });
    this.newItemEffects.push(newEffect);
  }

  async addNewItemToPlayer() {
    try {
      this.isLoadingItem = true;
      const itemValue = this.addItemForm.value;
      if (itemValue.existingItem) {
        const newItem: Item | Food | SpecialItem = {
          ...itemValue.existingItem,
        };
        if (newItem.type === ItemType.COMMON) {
          this.currentPlayer?.character?.items.generalItems.push(
            newItem as Item
          );
        } else {
          const items: Food[] | SpecialItem[] | Item[] | (Weapon | Armour)[] =
            newItem.type === ItemType.FOOD
              ? this.currentPlayer?.character?.items.food!
              : this.currentPlayer?.character?.items.specialItems!;
          const item = items.find((i) => i.id === newItem.id)!;
          if (!item) {
            items.push(newItem as any);
          } else {
            item.uses! += newItem.uses!;
          }
        }
        this.addItemForm.reset({
          existingItem: '',
        });
        this.addItemPanelVisible = false;
      } else {
        if (!itemValue.newItemName) {
          this.addItemError = 'Adj nevet a tárgynak!';
          this.isLoadingItem = false;
          return;
        }
        if (!itemValue.newItemType) {
          this.addItemError = 'Válassz egy típust!';
          this.isLoadingItem = false;
          return;
        }
        if (!itemValue.newItemCategory) {
          this.addItemError = 'Válassz egy kategóriát!';
          this.isLoadingItem = false;
          return;
        }
        let newItem: Item | Food | SpecialItem = {
          id: this.itemService.generateNewItemID(),
          name: itemValue.newItemName ?? '',
          type: itemValue.newItemType ?? '',
          size: ItemSize.NORMAL,
          category: itemValue.newItemCategory ?? '',
          desc: itemValue.newItemDesc ?? '',
          effects: [] as ItemEffect[],
          uses: itemValue.newItemUses ?? 1,
        };
        if (newItem.category === ItemCategory.CONSUMABLE && !newItem.uses) {
          this.addItemError = 'Adj meg érvényes mennyiséget!';
          this.isLoadingItem = false;
          return;
        }
        if (
          newItem.type === ItemType.MEDICAL ||
          newItem.type == ItemType.SPECIAL
        ) {
          if (!itemValue.newItemEffectDesc) {
            this.addItemError = 'Adj hatás leírást! Pl.: Gyógyulsz 2 HP-t.';
            this.isLoadingItem = false;
            return;
          }
          (newItem as any).effectDesc = itemValue.newItemEffectDesc ?? '';
        }
        if (itemValue.hasEffect) {
          if (this.newItemEffects.length === 0) {
            this.addItemError = 'Ajd hozzá legalább egy hatást a tárgyhoz!';
            this.isLoadingItem = false;
            return;
          }
          newItem.effects = [...this.newItemEffects];
        }
        if (newItem.type === ItemType.COMMON) {
          this.currentPlayer?.character?.items.generalItems.push(
            newItem as Item
          );
        } else {
          const items: Food[] | SpecialItem[] | Item[] | (Weapon | Armour)[] =
            newItem.type === ItemType.FOOD
              ? this.currentPlayer?.character?.items.food!
              : this.currentPlayer?.character?.items.specialItems!;
          const item = items.find((i) => i.id === newItem.id)!;
          if (!item) {
            items.push(newItem as any);
          } else {
            item.uses! += newItem.uses!;
          }
        }
        await this.gameService.updateGame(this.gameId!, {
          players: this.game?.players,
        });
        this.openSnackBar(
          `Tárgy hozzáadva ${this.currentPlayer?.name}-hez: ${newItem.name}`
        );
        this.addItemForm.reset({
          newItemName: '',
          newItemType: ItemType.COMMON,
          newItemCategory: ItemCategory.GENERAL,
          newItemDesc: '',
          newItemEffectDesc: '',
          newItemUses: 1,
          hasEffect: false,
        });
        this.addItemPanelVisible = false;
      }
    } catch (error) {
      console.error('Hiba az új tárgy létrehozásakor: ', error);
      this.isLoadingItem = false;
      this.addItemError = 'Hiba az új tárgy hozzáadásakor.';
      return;
    }
  }

  /* GAME MECHANICS */
  performAction() {
    if (this.actionForm.invalid) {
      this.actionError = 'Töltsd ki a kötelező mezőket!';
      return;
    }
    this.isPerformingAction = true;
    const formValue = this.actionForm.value;
    switch (formValue.type) {
      case ActionType.USEITEM:
        if (formValue.item === undefined || formValue.item === '') {
          this.actionError = 'Válassz egy tárgyat!';
          return;
        }
        const isPrimary: boolean = formValue.isPrimary ?? false;
        this.useItem(isPrimary);
        break;
      case ActionType.CAMP:
        this.askForCamp();
        break;
    }
    this.isPerformingAction = false;
  }

  async useItem(isPrimary: boolean) {
    if (this.player) {
      if (this.noactionsLeft()) {
        this.openSnackBar('Nincs több akciód!');
        return;
      }
      if (isPrimary && !this.player.actionsLeft.primary) {
        this.openSnackBar(
          'Nem használhatod elsődleges akcióként! Nincs elsődleges akciód.'
        );
        return;
      } else if (!isPrimary && !this.player.actionsLeft.secondary) {
        this.openSnackBar(
          'Nem használhatod másodlagos akcióként! Nincs másodlagos akciód.'
        );
        return;
      }
      if (this.selectedItem?.category !== ItemCategory.CONSUMABLE) {
        this.openSnackBar('Ez a tárgy még nem használható!');
        return;
      }
      switch (this.selectedItem?.category) {
        case ItemCategory.CONSUMABLE:
          try {
            this.openSnackBar(`Tárgy használva: ${this.selectedItem?.name}`);
            this.selectedItem?.effects?.forEach((effect) => {
              this.manageEffect(effect);
            });
            await this.manageItem(isPrimary);
            this.actionPanelVisible = false;
            this.actionForm.reset({
              type: '',
              item: '',
            });
          } catch (error: any) {
            this.openSnackBar(error.message);
            return;
          }
          break;
        default:
          console.warn('Ez a tárgy még nem használható!');
          this.snackBar.open('Ez a tárgy még nem használható!', 'OK', {
            duration: 2500,
          });
          break;
      }
    }
  }

  async manageItem(isPrimary: boolean) {
    try {
      if (this.player && this.selectedItem) {
        const itemName = this.selectedItem.name || 'Ismeretlen tárgy';
        if (
          !this.player.lastAction.performer.id &&
          !this.player.lastAction.performer.name
        ) {
          this.player.lastAction.performer = {
            id: this.player.id,
            name: this.player.name,
          };
        }
        if (isPrimary) {
          this.player.lastAction.primary = {
            type: ActionType.USEITEM,
            item: itemName,
          };
          this.player.actionsLeft.primary = false;
        } else {
          this.player.lastAction.secondary = {
            type: ActionType.USEITEM,
            item: itemName,
          };
          this.player.actionsLeft.secondary = false;
        }
        if (this.selectedItem.uses && this.selectedItem.uses > 0) {
          this.selectedItem.uses -= 1;
          if (this.selectedItem.uses === 0) {
            const index = this.currentInventory.findIndex(
              (i) => i.id === this.selectedItem!.id
            );
            if (index > -1) {
              this.currentInventory.splice(index, 1);
              console.log(this.currentInventory);
            }
          }
          if (this.role === PlayerRole.HOST) {
            this.currentEvent!.NPCs = this.currentEvent?.NPCs.map((p) =>
              p.id === this.currentUserId ? (this.player! as NPC) : p
            )!;
            await this.gameService.updateGame(this.gameId!, {
              adventure: this.game?.adventure,
            });
          } else {
            const updatedPlayers = this.game!.players.map((p) =>
              p.id === this.currentUserId ? (this.player! as Player) : p
            );
            await this.gameService.updateGame(this.gameId!, {
              players: updatedPlayers,
              currentAction: this.player.lastAction,
            });
          }
        }
      }
    } catch (error) {
      console.error('Hiba a tárgy kezelésekor: ', error);
      return;
    }
  }

  manageEffect(effect: ItemEffect) {
    const target = this.selectedTarget ?? this.player ?? this.selectedNPC;
    if (target && target.character) {
      let statusEffects = target.character.activeStatuses ?? [];
      let newStatus: ActiveStatus | undefined = undefined;
      switch (effect.type) {
        case EffectType.HEAL_HP:
          if (
            target.character.stats.main.hp < target.character.stats.main.maxHP
          ) {
            target.character.stats.main.hp = Math.min(
              target.character.stats.main.hp + effect.value!,
              target.character.stats.main.maxHP
            );
            break;
          }
          throw new Error('Nem lehetséges a gyógyítás! HP maximum elérve.', {
            cause: GameErrorCauses.HPAlreadyFull,
          });
        case EffectType.HEAL_SP:
          if (
            target.character.stats.main.sp < target.character.stats.main.maxSP
          ) {
            target.character.stats.main.sp = Math.min(
              target.character.stats.main.sp + effect.value!,
              target.character.stats.main.maxSP
            );
            break;
          }
          throw new Error('Nem lehetséges a gyógyítás! SP maximum elérve.', {
            cause: GameErrorCauses.SPAlreadyFull,
          });
        case EffectType.HEAL_SMALL_WOUND:
          if (target.character.wounds.small > 0) {
            target.character.wounds.small = Math.max(
              0,
              target.character.wounds.small - effect.value!
            );
            break;
          }
          throw new Error('Nem lehetséges a gyógyítás! Nincsenek kis sebek.', {
            cause: GameErrorCauses.NoSmallWounds,
          });
        case EffectType.HEAL_LARGE_WOUND:
          if (target.character.wounds.large > 0) {
            target.character.wounds.large = Math.max(
              0,
              target.character.wounds.large - effect.value!
            );
            break;
          }
          throw new Error('Nem lehetséges a gyógyítás! Nincsenek nagy sebek.', {
            cause: GameErrorCauses.NoLargeWounds,
          });
        case EffectType.BUFF_STAT:
          const physicalKeys = ['str', 'dex', 'end'];
          const mentalKeys = ['int', 'cun', 'wil'];
          if (physicalKeys.includes(effect.stat!)) {
            const key =
              effect.stat! as keyof typeof target.character.stats.physical;
            target.character.stats.physical[key] += effect.value!;
            break;
          } else if (mentalKeys.includes(effect.stat!)) {
            const key =
              effect.stat! as keyof typeof target.character.stats.mental;
            target.character.stats.mental[key] += effect.value!;
            break;
          }
          throw new Error(
            'Nem lehetséges a stat erősítése! A stat nem létezik.',
            {
              cause: GameErrorCauses.NoStatToBuff,
            }
          );
        case EffectType.ADD_STATUS:
          newStatus = {
            type: effect.status!,
            duration: effect.duration!,
            value: effect.value ?? 0,
          };
          if (!statusEffects.some((s) => s.type === newStatus?.type)!) {
            statusEffects.push(newStatus);
            target.character.activeStatuses = statusEffects;
            break;
          }
          if (this.selectedItem?.effects?.length === 1) {
            throw new Error(
              `Nem lehetséges a hatás hozzáadása. Már van ilyen hatás a karakteren: ${
                this.getStatusDetails(effect.status!).name
              }`,
              { cause: GameErrorCauses.NoStatusToAdd }
            );
          } else {
            Object.values(this.player?.character?.activeStatuses!).forEach(
              (s) => {
                if (s.type === newStatus?.type) {
                  s.duration += newStatus.duration;
                }
              }
            );
          }
          break;
        case EffectType.REMOVE_STATUS:
          newStatus = statusEffects.find((s) => s.type === effect.status);
          if (newStatus) {
            statusEffects = statusEffects.filter(
              (s) => s.type !== newStatus?.type
            );
            target.character.activeStatuses = statusEffects;
            break;
          }
          if (this.selectedItem?.effects?.length === 1) {
            throw new Error(
              'Nem lehetséges a hatás levétele. Nincs ilyen hatás: ' +
                this.getStatusDetails(effect.status!).name,
              { cause: GameErrorCauses.NoStatusToRemove }
            );
          } else {
            this.openSnackBar(
              `Nem lehetséges a hatás levétele. Nincs ilyen hatás: ${
                this.getStatusDetails(effect.status!).name
              }`
            );
          }
          break;
      }
    }
  }

  async askForCamp() {}

  async finishTurn() {
    try {
      if (this.role === PlayerRole.PLAYER) {
        const p = this.player?.actionsLeft.primary,
          s = this.player?.actionsLeft.secondary;
        if (p || s) {
          const actionType =
            p && s
              ? 'elsődleges és másodlagos'
              : p
              ? 'elsődleges'
              : 'másodlagos';
          const text = `Van még ${actionType} akciód. Biztosan befejezed a körödet?`;
          if (!confirm(text)) {
            return;
          }
        }
        const current = this.game?.initiatives.find(
          (i) => i.id === this.game?.currentPlayer
        );
        if (current) {
          current.finished = true;
          this.game?.initiatives.sort((a, b) => b.initiative - a.initiative);
          const next = this.game?.initiatives.find(
            (i) =>
              i.id !== this.game?.currentPlayer &&
              i.initiative <= current?.initiative &&
              !i.finished
          );
          if (next)
            await this.gameService.updateGame(this.gameId!, {
              currentPlayer: next.id,
              initiatives: this.game?.initiatives,
            });
          else {
            this.isNewRound = true;
            this.game?.initiatives.forEach((i) => {
              i.finished = false;
            });
            this.game?.players.forEach(
              (p) => (p.actionsLeft = { primary: true, secondary: true })
            );
            let newCurrentPlayer = this.game?.initiatives.sort(
              (a, b) => b!.initiative - a!.initiative
            )[0].id;
            await this.gameService.updateGame(this.gameId!, {
              currentPlayer: newCurrentPlayer,
              initiatives: this.game?.initiatives,
              players: this.game?.players,
            });
          }
        }
      }
    } catch (error) {
      console.error('Nem sikerült befejezni a kört: ', error);
      return;
    }
  }

  async leaveGame() {
    try {
      this.isLoading = true;
      this.dontWarnLeaving = true;
      await this.gameService.leaveGame(this.gameId!, this.role);
      this.router.navigateByUrl('/jatek');
    } catch (error) {
      this.isLoading = false;
      console.error('Hiba a játék elhagyásakor: ', error);
    }
  }
}
