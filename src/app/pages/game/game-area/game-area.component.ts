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
  MandatoryCampActions,
  NPC,
  Player,
  Reaction,
  StandardCampActions,
} from '../../../shared/models/models';
import { firstValueFrom, Subscription, take } from 'rxjs';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { MapContainerComponent } from '../../../shared/functional/map-container/map-container.component';
import { NgClass } from '@angular/common';
import {
  convertSpeciesNameToKey,
  createCharacter,
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
  Cigar,
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
  FormControl,
  FormArray,
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
import { NationData } from '../../../shared/models/NationData';
import { CharacterVirtues, CharacterDisadvantages } from '../../../shared/models/virtues_disadvantages';
import { species } from '../../world/species/species_desc_data';
import { VoiceService } from '../../../shared/services/voice/voice.service';
import { MatSliderModule } from '@angular/material/slider';
import { SmallScreenComponent } from '../../../shared/functional/small-screen/small-screen.component';
import { isMobileView } from '../../map/map.component';
import { UserService } from '../../../shared/services/user/user.service';

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
    MatSliderModule,
    SmallScreenComponent,
  ],
  templateUrl: './game-area.component.html',
  styleUrl: './game-area.component.scss',
})
export class GameAreaComponent implements CanComponentDeactivate {
  isLoading = false;
  @ViewChild('map') map!: MapContainerComponent;
  @ViewChild('diceRoller') diceRoller!: DiceRollerComponent;
  @ViewChild('isPartyWideCheckbox') isPartyWideCheckbox!: MatCheckbox;
  snackBar = new MatSnackBar();
  smallScreen = false;
  isNewRound = false;
  campingFirstWarn = true;
  raidFirstWarnd = false;
  playersFinishedCampActions = false;
  canPublishRaiders = false;
  actionForm!: FormGroup;
  addStatusForm!: FormGroup;
  addItemForm!: FormGroup;
  newItemEffectForm!: FormGroup;
  addRaiderForm!: FormGroup;
  fb = new FormBuilder();
  isPerformingAction = false;
  actionPanelVisible = false;
  actionError = '';
  addStatusPanelVisible = false;
  isLoadingStatus = false;
  addItemPanelVisible = false;
  isLoadingItem = false;
  addRaiderPanelVisible = false;
  reactionPanelVisible = false;
  lootPanelVisible = false;
  tradePanelVisible = false;
  attackReaction = false;
  isLoadingRaiders = false;
  soundControlVisible = false;
  addStatusError = '';
  addItemError = '';
  addItemEffectError = '';
  voting = false;
  voted = false;
  lastEvent = false;
  attackActionIsPrimary = false;
  checkedReaction = {
    primary: false,
    secondary: false,
  };

  private snackBarQueue: string[] = [];
  private isSnackBarShowing: boolean = false;

  activeInventory: 'f' | 's' | 'g' | 'e' = 's';
  currentInventory: (Food | SpecialItem | Item | Inventory)[] = [];
  selectedItemIdx?: number;
  selectedItem?: Food | SpecialItem | Item | null = null;
  selectedWeapon?: Weapon | null = null;
  selectedTarget?: Player | NPC | null = null;
  performedActions = {
    primary: {} as GameAction,
    secondary: {} as GameAction,
  };

  currentPlayer?: Player | NPC | null = null;
  firstEvent = true;
  isInspectingNPC = false;
  selectedNPC?: NPC | null = null;
  selectedPlayerStatus?: ActiveStatus | null = null;
  newItemEffects: ItemEffect[] = [];

  gameId = '';
  game?: Game | null;
  player?: Player | NPC | null;
  myCharacterSpecs?: {
    speciesSpecial: { desc: string };
    home: { desc: string; bonus: { name: string; mod: string }[] };
    stats: number[];
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
        const type = item.type || '';
        if (!groups[type]) {
          groups[type] = [];
        }
        if (this.actionForm.get('type')?.value === StandardCampActions.TREAT_WOUNDS) {
          if (item.type !== ItemType.MEDICAL && item.type !== ItemType.FOOD) return;
        }
        if (this.player?.inCombat) {
          if (!('combat' in item) || !item.combat) return;
        }
        groups[type].push(item);
      });
    });
    return Object.keys(groups).map((key) => ({
      label: this.itemTypeLabels[key] || key,
      items: groups[key],
    }));
  }

  loot: (Item | Food | SpecialItem)[] = [];
  looted: (Item | Food | SpecialItem)[] = [];
  itemsToBuy: (Item | Food | SpecialItem)[] = [];
  itemsToSell: (Item | Food | SpecialItem)[] = [];
  sellItems = false;
  totalPrice = 0;
  totalSell = 0;

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
  MandatoryCampActions = MandatoryCampActions;
  StandardCampActions = StandardCampActions;
  ActionTypes = [
    { value: ActionType.USEITEM, viewValue: 'Tárgy használata', icon: 'grocery' },
    { value: ActionType.CAMP, viewValue: 'Táborozás', icon: 'camping' },
    { value: ActionType.TRADE, viewValue: 'Kereskedés', icon: 'storefront' },
    { value: ActionType.ATTACK, viewValue: 'Támadás', icon: 'swords' },
    { value: ActionType.LOOT, viewValue: 'Kifosztás', icon: 'money_bag' },
  ];
  MandatoryCampActionsArray = [
    { value: MandatoryCampActions.START_FIRES, viewValue: 'Tűzgyújtás', icon: 'fireplace', cost: 3 },
    { value: MandatoryCampActions.SET_UP_TENTS, viewValue: 'Sátrak felállítása', icon: 'camping', cost: 5 },
    { value: MandatoryCampActions.SET_UP_TRAPS, viewValue: 'Csapdák felállítása', icon: 'webhook', cost: 5 },
    { value: MandatoryCampActions.GUARD, viewValue: 'Őrség', icon: 'visibility', cost: 8 },
  ]
  StandardCampActionsArray = [
    { value: StandardCampActions.TREAT_WOUNDS, viewValue: 'Sérülések ápolása', icon: 'healing', cost: 1 },
    { value: StandardCampActions.CALM_OTHERS, viewValue: 'Társak megnyugtatása', icon: 'diversity_3', cost: 2 },
    { value: StandardCampActions.GATHER_PLANTS, viewValue: 'Növény gyűjtés', icon: 'spa', cost: 3 },
    { value: StandardCampActions.HUNT, viewValue: 'Vadászat', icon: 'pets_control_rodent', cost: 4 },
  ]
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
    { value: StatusType.LOST_LIMB },
    { value: StatusType.DEAD },
    { value: StatusType.INSANE },
  ];
  ItemTypes = [
    { value: ItemType.FOOD, name: 'Étel', icon: 'beer_meal' },
    { value: ItemType.MEDICAL, name: 'Gyógyszer', icon: 'health_cross' },
    { value: ItemType.SPECIAL, name: 'Különleges ital', icon: 'science' },
    { value: ItemType.CIGAR, name: 'Szivar', icon: 'smoking_rooms' },
    //{ value: ItemType.COMMON, name: 'Általános', icon: 'category' },
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
      name: 'Státusz elvétel',
      icon: 'remove',
    },
  ];
  campActionCosts = {
    fire: 3, tents: 5, traps: 5, guard: 8, calm: 2, gather: 3, hunt: 4, useitem: 1
  }
  campActionSubtypes: { value: string, viewValue: string, desc: string }[] = [];
  campActionSubTypeMap: Record<string, { value: string, viewValue: string, roll: number, check: string, bonus: number, bonusName: string, desc: string }[]> = {
    [StandardCampActions.CALM_OTHERS]: [
      { value: 'jokes', viewValue: 'Vicc mesélés', roll: 6, check: 'int', bonus: 1, bonusName: 'heal_sp', desc: 'CÉ 6 (Ész): +1 stressz gyógyulás' },
      { value: 'story', viewValue: 'Történet mesélés', roll: 10, check: 'cun', bonus: 2, bonusName: 'heal_sp', desc: 'CÉ 10 (Fortély): +2 stressz gyógyulás' },
      { value: 'sing', viewValue: 'Éneklés', roll: 14, check: 'end', bonus: 3, bonusName: 'heal_sp', desc: 'CÉ 14 (Kitartás): +3 stressz gyógyulás' },
      { value: 'music', viewValue: 'Zenélés', roll: 16, check: 'dex', bonus: 4, bonusName: 'heal_sp', desc: 'CÉ 16 (Ügyesség): +4 stressz gyógyulás' },
    ],
    [StandardCampActions.GATHER_PLANTS]: [
      { value: 'spices', viewValue: 'Fűszerek gyűjtése', roll: 5, check: 'dex', bonus: 1, bonusName: 'food', desc: 'CÉ 5 (Ügyesség): +1 fejadag a meglévő ételekhez' },
      { value: 'drugs', viewValue: 'Füvek gyűjtése', roll: 10, check: 'dex', bonus: 1, bonusName: 'heal_sp', desc: 'CÉ 10 (Ügyesség): +1 stressz gyógyulás' },
      { value: 'herbs', viewValue: 'Gyógynövények gyűjtése', roll: 15, check: 'int', bonus: 1, bonusName: 'heal_s_w', desc: 'CÉ 15 (Ész): 1 kis seb gyógyítás' },
    ],
    [StandardCampActions.HUNT]: [
      { value: 'small', viewValue: 'Kis állatok', roll: 5, check: 'dex', bonus: 2, bonusName: 'food', desc: 'CÉ 5 (Ügyesség): +2 fejadag az ételekhez' },
      { value: 'medium', viewValue: 'Közepes állat', roll: 10, check: 'end', bonus: 5, bonusName: 'food', desc: 'CÉ 10 (Kitartás): +5 fejadag az ételekhez' },
      { value: 'large', viewValue: 'Nagy állat', roll: 15, check: 'str', bonus: 8, bonusName: 'food', desc: 'CÉ 15 (Erő): +8 fejadag az ételekhez' },
    ]
  }

  /* CAMP RAIDER CREATION */
  raiders: NPC[] = [];
  speciesList = NationData.map((nation) => nation.nationName);
  currentSpeciesProperties: { desc: string }[] = [];
  currentSpeciesHomes: {
    desc: string;
    bonus: { name: string; mod: string }[];
  }[] = [];
  currentHome: { desc: string; bonus: { name: string; mod: string }[] } | null =
    null;
  weapons = [] as Weapon[];
  armours = [] as Armour[];

  virtues = CharacterVirtues.map((virtue) => virtue.name);
  disadvantages = CharacterDisadvantages.map((disadv) => disadv.name);

  statsForm = [
    {
      controlName: 'physical',
      fields: [
        { groupName: 'str', labelText: 'Erő', icon: 'fitness_center' },
        {
          groupName: 'dex',
          labelText: 'Ügyesség',
          icon: 'sports_martial_arts',
        },
        { groupName: 'end', labelText: 'Kitartás', icon: 'directions_run' },
      ],
      interval: { min: -15, max: 15 },
    },
    {
      controlName: 'mental',
      fields: [
        { groupName: 'int', labelText: 'Ész', icon: 'auto_stories' },
        { groupName: 'cun', labelText: 'Fortély', icon: 'psychology' },
        { groupName: 'wil', labelText: 'Akaraterő', icon: 'diamond' },
      ],
      interval: { min: -15, max: 15 },
    },
    {
      controlName: 'main',
      fields: [
        { groupName: 'hp', labelText: 'HP', icon: 'health_metrics' },
        { groupName: 'sp', labelText: 'SP', icon: 'mindfulness' },
      ],
      interval: { min: 1, max: 50 },
    },
  ];

  foods = [] as Food[];
  specialIndex = 0;
  specialItems = [] as SpecialItem[];
  generalItems = [] as (Item | Inventory)[];
  /* ------------------- */

  private diceRollResolver: ((value: number) => void) | null = null;
  diceRollTimeOut = 1000;
  showDiceRoller = false;
  diceToRoll: string[] = ['d20'];
  rollModifier: number = 0;
  diceCountModifier: 'adv' | 'disadv' | null = null;
  lastRoll = 0;

  allItems: any[] = [];

  dontWarnLeaving = false;

  voiceStream?: MediaStream;
  voiceInitialized = false;
  connectedPeers: string[] = [];

  gameSub!: Subscription;
  voiceSub!: Subscription;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private gameService: GameService,
    private router: Router,
    private itemService: ItemService,
    private voiceService: VoiceService,
    private userService: UserService
  ) { }

  async ngOnInit() {
    setBackground('#222', true);
    this.smallScreen = isMobileView();
    this.gameId = this.route.snapshot.paramMap.get('id')!;
    if (!this.gameId) {
      this.dontWarnLeaving = true;
      this.router.navigateByUrl('/jatek')
    }
    this.initForm();
    this.voiceStream = this.voiceService.getStream();
    this.voiceSub = this.voiceService.activePeers.subscribe(peers => {
      this.connectedPeers = peers;
    });
    await this.itemService.initItems();
    this.weapons = this.itemService.getItemGroup('weapons') as Weapon[];
    this.armours = this.itemService.getItemGroup('armours') as Armour[];
    this.foods = this.itemService.getItemGroup('food') as Food[];
    this.specialItems = this.itemService.getItemGroup(
      'allSpecial'
    ) as SpecialItem[];
    this.generalItems = this.itemService.getItemGroup('general') as (
      | Item
      | Inventory
    )[];
    this.allItems = this.itemService.getAllItems();
    const user = await firstValueFrom(this.authService.currentUser.pipe(take(1)))
    this.currentUserId = user?.uid!;
    await this.loadData();
  }

  ngOnDestroy() {
    if (this.gameSub) this.gameSub.unsubscribe();
    if (this.voiceSub) this.voiceSub.unsubscribe();
    this.voiceService.destroy();
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
    //await this.leaveGame();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.smallScreen = isMobileView();
  }

  goHome() {
    this.dontWarnLeaving = true;
    this.router.navigateByUrl('/jatek');
  }

  /* GENERAL FUNCTIONS */
  initForm() {
    this.actionForm = this.fb.group({
      type: ['', [Validators.required]],
      isPrimary: [false],
      isPartyWide: [false],
      target: [''],
      item: [''],
      caSubType: [''],
      customCA: [0, [Validators.pattern('^[0-9]+$')]]
    });
    this.addStatusForm = this.fb.group({
      type: [StatusType.BLEED, [Validators.required]],
      duration: [
        1,
        [Validators.required, Validators.min(1), Validators.max(99999)],
      ],
      value: [1, [Validators.min(1), Validators.max(99999)]],
    });
    this.addItemForm = this.fb.group({
      existingItem: [''],
      name: [
        '',
        [
          noWhitespaceValidator,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      desc: [
        '',
        [
          noWhitespaceValidator,
          Validators.minLength(0),
          Validators.maxLength(200),
        ],
      ],
      type: [ItemType.FOOD],
      uses: [1, [Validators.min(1), Validators.max(100)]],
      effectDesc: [
        '',
        [
          noWhitespaceValidator,
          Validators.minLength(0),
          Validators.maxLength(200),
        ],
      ],
      effects: this.fb.array([]),
      isPartyWide: [false],
      combat: [false],
      color: [''],
      spice: [''],
      hasEffect: [false],
    });
    this.newItemEffectForm = this.fb.group({
      type: [EffectType.HEAL_HP, [Validators.required]],
      duration: [1, [Validators.required, Validators.min(1), Validators.max(1000)]],
      value: [1, [Validators.required, Validators.min(1), Validators.max(50)]],
      stat: ['str', [Validators.required]],
      status: [StatusType.BLEED, [Validators.required]],
      target: ['self', [Validators.required]],
    });
    this.addRaiderForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), noWhitespaceValidator]],
      species: [null, [Validators.required]],
      specialProperties: this.fb.group({
        speciesSpecial: [null, [Validators.required]],
        home: [null, [Validators.required]],
      }),
      stats: this.fb.group({
        physical: this.fb.group({
          str: [0, [Validators.min(-15), Validators.max(15)]],
          dex: [0, [Validators.min(-15), Validators.max(15)]],
          end: [0, [Validators.min(-15), Validators.max(15)]],
        }),
        mental: this.fb.group({
          int: [0, [Validators.min(-15), Validators.max(15)]],
          cun: [0, [Validators.min(-15), Validators.max(15)]],
          wil: [0, [Validators.min(-15), Validators.max(15)]],
        }),
        main: this.fb.group({
          sp: [0, [Validators.min(1), Validators.max(30)]],
          hp: [0, [Validators.min(1), Validators.max(30)]],
        }),
      }),
      equipment: this.fb.group({
        left: [],
        right: [],
        armour: [],
      }),
    })
    this.actionForm.get('target')?.valueChanges.subscribe((value) => {
      this.selectedTarget = this.game?.players.find((p) => p.id === value) ??
        this.game?.camp.raid.find((p) => p.id === value) ??
        this.currentEvent?.NPCs.find((p) => p.id === value) ?? null;
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
          'isPartyWide' in item ? item.isPartyWide : false,
        );
        if (this.isPartyWideCheckbox) this.isPartyWideCheckbox.disabled = true;
        this.selectedItem = item;
      }
    });
    this.actionForm.get('type')?.valueChanges.subscribe((value) => {
      const isPartyWide = this.actionForm.get('isPartyWide');
      switch (value) {
        case ActionType.CAMP:
          isPartyWide?.patchValue(true);
          if (this.isPartyWideCheckbox) this.isPartyWideCheckbox.disabled = true;
          this.resetSelectedItem();
          break;
        case ActionType.USEITEM:
          if (this.isPartyWideCheckbox) this.isPartyWideCheckbox.disabled = true;
          isPartyWide?.patchValue(false);
          break;
        case ActionType.ATTACK:
          if (this.isPartyWideCheckbox) this.isPartyWideCheckbox.disabled = true;
          break;
        case MandatoryCampActions.START_FIRES:
        case MandatoryCampActions.SET_UP_TENTS:
        case MandatoryCampActions.SET_UP_TRAPS:
        case MandatoryCampActions.GUARD:
          if (this.isPartyWideCheckbox) this.isPartyWideCheckbox.disabled = true;
          this.actionForm.get('subType')?.patchValue('');
          break;
        case StandardCampActions.CALM_OTHERS:
        case StandardCampActions.GATHER_PLANTS:
        case StandardCampActions.HUNT:
          this.campActionSubtypes = this.campActionSubTypeMap[value]
          break;
        default:
          if (this.isPartyWideCheckbox) this.isPartyWideCheckbox.disabled = true;
          isPartyWide?.patchValue(false);
          this.resetSelectedItem();
          break;
      }
    });
  }

  loadData() {
    this.gameSub = this.gameService.getGame(this.gameId).subscribe(async (game) => {
      if (!game) {
        this.dontWarnLeaving = true;
        this.router.navigateByUrl('/jatek');
        return;
      }

      this.game = game;

      if (!this.game.started) {
        this.dontWarnLeaving = true;
        await this.userService.updateUser(this.currentUserId, { inGame: false });
        this.router.navigateByUrl('/jatek');
        return;
      }

      this.voiceInitialized = this.voiceService.getStream() !== undefined;

      game.players.sort(
        (a: Player, b: Player) => b.initiative! - a.initiative!,
      );
      this.role = checkRole(this.currentUserId, this.game.ownerId);
      this.currentEventIdx = game.currentEvent;
      this.setCurrentEvent();

      if (game.camp.isCamping && this.campingFirstWarn) {
        this.openSnackBar('Táborozás következik.')
        this.campingFirstWarn = false;

      }
      if (!game.camp.isCamping && !this.campingFirstWarn) { this.openSnackBar('Vége a táborozásnak.'); this.campingFirstWarn = true; }
      if (game.camp.raid.length > 0 && !this.raidFirstWarnd) { this.openSnackBar('Rajtaütés'); this.raidFirstWarnd = true; }
      if (game.currentEvent === game.adventure?.events.length! - 1 && !this.lastEvent) { this.openSnackBar('Utolsó esemény!'); this.lastEvent = true; }

      if (this.role === PlayerRole.PLAYER) {
        const foundPlayer = this.game.players.find(
          (p) => p.id === this.currentUserId,
        );

        if (!foundPlayer) {
          this.dontWarnLeaving = true;
          await this.userService.updateUser(this.currentUserId, { inGame: false });
          this.router.navigateByUrl('/jatek');
          return;
        }

        this.player = foundPlayer;
        if (this.player.character) {
          const adv = this.player?.character?.activeStatuses.find(s => s.type === StatusType.ADVANTAGE);
          const disAdv = this.player?.character?.activeStatuses.find(s => s.type === StatusType.DISADVANTAGE);
          this.diceCountModifier = adv ? 'adv' : disAdv ? 'disadv' : null;
          this.setUpCharacterSpecs(this.player.character);
        }
        if (game.vote.theme !== '') {
          this.voting = true;
          this.voted = game.vote.votes.find(v => v.player === this.player?.name)?.vote ?? false;
          if (game.vote.votes.length === game.players.length) {
            this.voting = false;
          }
        } else {
          this.voting = false;
        }
        this.myTurn = this.player.id === game.currentPlayer;
        if (localStorage.getItem('selectedWeapon' + this.player.id)) {
          const selectedWeaponId = localStorage.getItem('selectedWeapon' + this.player.id);
          if (selectedWeaponId) {
            if (this.myCharacterSpecs?.equipment.left.id === parseInt(selectedWeaponId))
              this.selectedWeapon = this.myCharacterSpecs?.equipment.left;
            else if (this.myCharacterSpecs?.equipment.right.id === parseInt(selectedWeaponId))
              this.selectedWeapon = this.myCharacterSpecs?.equipment.right;
            else this.selectedWeapon = null;
          }
        }
        if (!this.player.inCombat && localStorage.getItem('selectedCombatTarget')) {
          localStorage.removeItem('selectedCombatTarget');
        }
        if (this.isReacting()) {
          if (!this.attackReaction) {
            this.attackReaction = true;
            this.reactionPanelVisible = true;
            if (this.game?.currentAction.primary.type === ActionType.ATTACK) this.attackActionIsPrimary = true;
            else this.attackActionIsPrimary = false;
            const damage = this.attackActionIsPrimary ? this.game?.currentAction.primary.value : this.game?.currentAction.secondary.value;
            this.openSnackBar(`Reakció a támadásra (${this.game?.currentAction.performer.name} : -${damage} HP)`);
          }
        } else {
          this.reactionPanelVisible = false;
          this.attackReaction = false;
        }
      } else {
        this.myTurn =
          this.player?.id === game?.currentPlayer;
        if (game.camp.isCamping && game.playerOrder.every(p => p.finished)) {
          if (!this.playersFinishedCampActions) this.openSnackBar('A táborozás kiértékelhető.')
          this.playersFinishedCampActions = true;
        }
        if (game.vote.theme && game.vote.votes.length === game.players.length) {
          let result = this.evaluateVote();
          this.game?.players.forEach(p => {
            p.isVoting = false;
          })
          this.game.camp.isCamping = result
          this.game.vote = { theme: '', starter: '', votes: [] };
          if (result) {
            this.calculateCampActions();
            await this.startNewTurn();
          }else{
            await this.gameService.updateGame(this.gameId, {
              vote: this.game.vote,
              players: this.game?.players,
              camp: this.game.camp
            });
          }
        }
        this.currentPlayer = game.players.find(
          (p) => p.id === game.currentPlayer)! ??
          this.currentEvent?.NPCs.find(n => n.id === game.currentPlayer) ??
          game.camp.raid.find(r => r.id === game.currentPlayer)!;
        if (this.currentPlayer?.id.includes('-')) {
          this.player = this.currentPlayer;
          this.currentPlayer = null;
        } else {
          const npcTargeted = this.game.camp.raid.find(r => r.id === game.currentPlayer) ??
            this.currentEvent?.NPCs.find(n => n.id === game.currentPlayer);
          if (!this.player && npcTargeted) {
            this.player = npcTargeted;
          }
        }
        if (this.player) {
          const selectedId = this.player.id;
          this.player =
            this.game.camp.raid.find(r => r.id === selectedId) ??
            this.game.adventure?.events[this.currentEventIdx]?.NPCs.find(n => n.id === selectedId) ??
            this.game.players.find(p => p.id === selectedId) ??
            this.raiders.find(r => r.id === selectedId) ??
            null;
          this.setUpCharacterSpecs(this.player?.character!);
          if (localStorage.getItem('selectedWeapon' + this.player?.id)) {
            const selectedWeaponId = parseInt(localStorage.getItem('selectedWeapon' + this.player?.id) ?? '-1');
            if (selectedWeaponId !== -1) {
              if (this.myCharacterSpecs?.equipment.left.id === selectedWeaponId) this.selectedWeapon = this.myCharacterSpecs?.equipment.left;
              else if (this.myCharacterSpecs?.equipment.right.id === selectedWeaponId) this.selectedWeapon = this.myCharacterSpecs?.equipment.right;
              else this.selectedWeapon = null;
            }
          }
        } else {
          this.player = null;
        }
        const adv = this.player?.character?.activeStatuses.find(s => s.type === StatusType.ADVANTAGE);
        const disAdv = this.player?.character?.activeStatuses.find(s => s.type === StatusType.DISADVANTAGE);
        this.diceCountModifier = adv ? 'adv' : disAdv ? 'disadv' : null;
        this.myTurn = this.player?.id === game.currentPlayer;
        if (this.currentPlayer && this.currentPlayer.character) {
          this.setUpCharacterSpecs(this.currentPlayer.character);
        }
        const raiders = localStorage.getItem('raiders');
        if (raiders && raiders.length > 0) {
          this.raiders = JSON.parse(raiders);
        }
        if (this.allRaidersDead()) {
          this.playersFinishedCampActions = true;
        }
        if (this.isReacting()) {
          if (!this.attackReaction) {
            this.attackReaction = true;
            this.reactionPanelVisible = true;
            if (this.game?.currentAction.primary.type === ActionType.ATTACK) this.attackActionIsPrimary = true;
            else this.attackActionIsPrimary = false;
            const damage = this.attackActionIsPrimary ? this.game?.currentAction.primary.value : this.game?.currentAction.secondary.value;
            this.openSnackBar(`Reakció a támadásra (${this.game?.currentAction.performer.name} : -${damage} HP)`);
          }
        } else {
          this.reactionPanelVisible = false;
          this.attackReaction = false;
        }
      }
      if (game?.currentPlayer !== game?.playerOrder[0].id && this.isNewRound) {
        this.isNewRound = false;
      }
      if (game?.currentPlayer === game?.playerOrder[0].id &&
        game.playerOrder.every((i) => i.finished === false) &&
        !this.isNewRound && (this.player ? (!this.player?.actionsLeft.primary && !this.player?.actionsLeft.secondary) : true)
      ) {
        this.openSnackBar('Új kör következik!');
        this.isNewRound = true;
      }
      if (!this.myTurn) {
        this.resetSelectedItem();
        this.selectedTarget = null;
        this.selectedNPC = null;
      } else {
        if (!this.isReacting()) this.checkReaction();
        const savedTargetId = localStorage.getItem('selectedCombatTarget');
        if (savedTargetId) {
          const target = this.game.players.find(p => p.id === savedTargetId) ??
            this.game.camp.raid.find(r => r.id === savedTargetId) ??
            this.currentEvent?.NPCs.find(n => n.id === savedTargetId) ?? null;
          if (target) this.selectedTarget = target;
        }
      }
    });
  }

  async joinVoiceChat() {
    try {
      if (this.voiceService.getStream()) {
        this.voiceStream = this.voiceService.getStream();
      } else {
        this.voiceStream = await this.voiceService.getMicrophone();
      }
      this.voiceService.initPeer(this.currentUserId);
      setTimeout(() => {
        if (!this.voiceService.hasActiveConnection()) {
          console.warn('Nincs aktív Peer kapcsolat, nem lehet hívni a többieket.');
          return;
        }
        if (this.game?.ownerId! !== this.currentUserId) this.voiceService.connectToPeer(this.game?.ownerId!);
        this.game?.players!.forEach((p) => {
          if (p.id !== this.currentUserId) {
            this.voiceService.connectToPeer(p.id);
          }
        });
      }, 1000);
    } catch (error: any) {
      console.error('Hiba a csatlakozáskor:', error);
      alert('Nem sikerült csatlakozni. Engedélyezd a mikrofon használatát, és próbáld újra!');
    }
  }
  toggleMute() {
    switch (this.voiceService.muted()) {
      case true:
        this.voiceService.unMute();
        break;
      case false:
        this.voiceService.mute();
        break;
    }
  }
  isPhone(): boolean {
    return window.innerWidth <= 768 || window.innerHeight <= 605;
  }
  isMuted(): boolean {
    return this.voiceService.muted();
  }
  toggleDeafen() {
    this.voiceService.toggleDeafen(!this.voiceService.deafened());
  }
  isDeafened(): boolean {
    return this.voiceService.deafened();
  }
  leaveCall() {
    this.voiceStream = undefined;
    this.voiceService.destroy();
  }
  showSoundSettings(visible: boolean = true) {
    this.soundControlVisible = visible;
  }
  setVolume(id: string, volume: number) {
    console.log(volume);
    if (volume < 0 || volume > 1) return;
    this.voiceService.setPeerVolume(id, volume);
  }
  getVolume(id: string): number {
    return this.voiceService.getPeerVolume(id);
  }

  openDiceRoller(dice: string[] = ['d20']): Promise<number> {
    this.diceToRoll = dice;
    this.showDiceRoller = true;

    return new Promise<number>((resolve) => {
      this.diceRollResolver = resolve;
    })
  }
  onDiceRollFinished(result: number) {
    this.lastRoll = result;
    setTimeout(() => {
      this.showDiceRoller = false;
      this.rollModifier = 0;
      setTimeout(() => {
        if (this.diceRollResolver) {
          this.diceRollResolver(result);
          this.diceRollResolver = null;
        }
      }, 100);
    }, this.diceRollTimeOut);
  }
  closeDiceRoller() {
    this.showDiceRoller = false;
  }
  rollCheck(statMod: number) {
    if (!this.myTurn || statMod === undefined) return Promise.resolve(0);
    this.rollModifier = statMod;
    return this.openDiceRoller(['d20']);
  }

  async rollForAttack(diceCount: number | undefined, damage: string | undefined) {
    if (!this.myTurn) return;
    if (!diceCount || !damage) return;
    let dices = [];
    for (let i = 0; i < diceCount; i++) {
      dices.push(damage);
    }
    await this.openDiceRoller(dices);
    this.openSnackBar(`Támadás "${this.selectedTarget?.name}" ellen "${this.lastRoll}" sebzéssel.`)
  }

  setRelevantSpeciesData(value: any) {
    let currentSpecies = convertSpeciesNameToKey(value);
    this.currentSpeciesProperties =
      species[currentSpecies!.landID][currentSpecies!.speciesID].speciesSpecial;
    this.currentSpeciesHomes =
      species[currentSpecies!.landID][currentSpecies!.speciesID].homes;
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
        character.specialProperties.speciesProperty,
      ),
      home: getHome(character.species, character.specialProperties.home),
      equipment: {
        left: character.equipment.left,
        right: character.equipment.right,
        armour: character.equipment.armour,
      },
      stats: [],
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
    Object.entries(character?.stats!).forEach(([key, value]) => {
      if (key !== 'main') {
        Object.values(value).forEach((value) => {
          this.myCharacterSpecs?.stats.push(value);
        });
      }
    });
    this.selectInventory();
  }

  locateCurrentEventLocation() {
    const loc: Location | null = getLocationByName(
      this.currentEvent?.location!,
    );
    if (loc && this.map) this.map.locatePoint(loc, false);
  }

  setCurrentEvent() {
    this.firstEvent = this.currentEventIdx === 0;
    this.lastEvent = this.currentEventIdx === this.game?.adventure?.events?.length! - 1;
    this.currentEvent = this.game?.adventure?.events[this.currentEventIdx];
    const loc: Location | null = getLocationByName(
      this.currentEvent?.location!,
    );
    if (loc && this.map) this.map.locatePoint(loc, false);
  }

  async switchEvent(next: boolean) {
    try {
      if (next && this.currentEventIdx! === this.game?.adventure?.events?.length! - 1) {
        this.openSnackBar('Nincs több esemény.');
        return;
      }
      let eventIdx = this.currentEventIdx!;
      if (next && confirm('Tovább léptek a következő eseményre.')) {
        eventIdx += 1;
      } else if (confirm('Visszaléptetek az előző eseményre.')) {
        eventIdx -= 1;
      }
      await this.gameService.updateGame(this.gameId, {
        currentEvent: eventIdx,
      });
    } catch (error) {
      console.error('Hiba történt az esemény váltásakor');
    }
  }

  showActionPanel(
    event: MouseEvent,
    action?: ActionType | MandatoryCampActions | StandardCampActions,
    show: boolean = true,
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
          target: this.selectedTarget.id,
        });
      }
    }
    this.actionPanelVisible = show;
  }
  showPanel(type: 'status' | 'item' | 'raider' | 'reaction' | 'loot' | 'trade' | 'sound', event: MouseEvent | null, show: boolean = true) {
    const target = event?.target as HTMLElement;
    switch (type) {
      case 'status':
        if (target.id !== 'addStatusUI' && !show) return;
        this.addStatusPanelVisible = show;
        break;
      case 'item':
        if (target.id !== 'addItemUI' && !show) return;
        this.addItemPanelVisible = show;
        break;
      case 'raider':
        if (target.id !== 'addRaiderUI' && !show) return;
        this.addRaiderPanelVisible = show;
        break;
      case 'reaction':
        if (target.id !== 'reactionUI' && !show) return;
        this.reactionPanelVisible = show;
        break;
      case 'loot':
        if (target.id !== 'closeLootUI' && !show) return;
        if (!show) {
          this.loot = [];
          this.looted = [];
        }
        this.lootPanelVisible = show;
        break;
      case 'trade':
        if (!show) {
          [...this.itemsToBuy].forEach((i: any) => {
            this.addToTrade('buy', 'remove', i as any, true);
          });
          this.itemsToBuy = [];
          this.totalPrice = 0;
          [...this.itemsToSell].forEach((i: any) => {
            this.addToTrade('sell', 'remove', i as any, true);
          });
          this.itemsToSell = [];
          this.totalSell = 0;
        }
        this.tradePanelVisible = show;
        break;
      case 'sound':
        if (target.id !== 'soundUI' && !show) return;
        this.soundControlVisible = show;
        break;
    }
  }
  openSnackBar(msg: string) {
    this.snackBarQueue.push(msg);
    if (!this.isSnackBarShowing) {
      this.showNextSnackBar();
    }
  }
  private showNextSnackBar() {
    if (this.snackBarQueue.length === 0) {
      this.isSnackBarShowing = false;
      return;
    }
    this.isSnackBarShowing = true;
    const nextMessage = this.snackBarQueue.shift();
    let snackBarRef = this.snackBar.open(nextMessage!, 'OK', {
      duration: 2500,
    });
    snackBarRef.afterDismissed().subscribe(() => {
      this.showNextSnackBar();
    });
  }
  /* GETTERS */
  getActionName(type: ActionType | MandatoryCampActions | StandardCampActions) {
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
      case ActionType.LOOT:
        return 'Kifosztás';
      case MandatoryCampActions.START_FIRES:
        return 'Tűzgyújtás';
      case MandatoryCampActions.SET_UP_TENTS:
        return 'Sátrak felállítása';
      case MandatoryCampActions.SET_UP_TRAPS:
        return 'Csapdák felállítása';
      case MandatoryCampActions.GUARD:
        return 'Őrség';
      case StandardCampActions.TREAT_WOUNDS:
        return 'Sérülések ápolása';
      case StandardCampActions.CALM_OTHERS:
        return 'Társak megnyugtatása';
      case StandardCampActions.GATHER_PLANTS:
        return 'Növény gyűjtés';
      case StandardCampActions.HUNT:
        return 'Vadászat';
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
  getCampActionCost(type: MandatoryCampActions | StandardCampActions) {
    switch (type) {
      case MandatoryCampActions.START_FIRES:
        return this.campActionCosts.fire;
      case MandatoryCampActions.SET_UP_TENTS:
        return this.campActionCosts.tents;
      case MandatoryCampActions.SET_UP_TRAPS:
        return this.campActionCosts.traps;
      case MandatoryCampActions.GUARD:
        return this.campActionCosts.guard;
      case StandardCampActions.TREAT_WOUNDS:
        return this.campActionCosts.useitem;
      case StandardCampActions.CALM_OTHERS:
        return this.campActionCosts.calm;
      case StandardCampActions.GATHER_PLANTS:
        return this.campActionCosts.gather;
      case StandardCampActions.HUNT:
        return this.campActionCosts.hunt;
    }
  }
  getInputs(which: string): FormArray<FormControl<number>> {
    return this.addRaiderForm.get(which) as FormArray<FormControl<number>>;
  }
  cantReact(): boolean {
    return this.player?.character?.activeStatuses.filter(s => s.type === StatusType.LOST_LIMB).length === 2
  }
  /**
   * Ellenőrzi, hogy a játékosokon rajtaütöttek-e táborozáskor.
   * @returns A játékosokon rajtaütöttek-e táborozáskor.
   */
  isRaid(): boolean {
    return this.game?.camp.raid.length! > 0 && this.game?.camp.isCamping === true;
  }
  isWaitingForGM(): boolean {
    return (this.game?.players.every(p => p.campActionPoints === 0) && this.game?.camp?.isCamping && !this.isRaid()) ?? false;
  }
  /**
   * Ellenőrzi, hogy a játékos reagál-e egy támadásra.
   */
  isReacting(): boolean {
    let a = [this.game?.currentAction.primary, this.game?.currentAction.secondary];
    return a.some(a => a?.target === this.player?.id && a?.type === ActionType.ATTACK && !a?.reaction!.reacted) && this.myTurn;
  }
  getName(id: string | undefined): string {
    if (!id) return 'Ismeretlen';
    const object = this.game?.players.find(p => p.id === id) ??
      this.currentEvent?.NPCs.find(n => n.id === id) ??
      this.game?.camp.raid.find(r => r.id === id);
    return object ? object.name : 'Ismeretlen';
  }
  isDead(character: Character): boolean {
    return character?.activeStatuses.some(s => s.type === StatusType.DEAD);
  }
  isInsane(character: Character): boolean {
    return character?.activeStatuses.some(s => s.type === StatusType.INSANE);
  }
  attackIsPrimary(): boolean {
    return this.game?.currentAction.primary.type === ActionType.ATTACK && !this.game?.currentAction.primary.reaction!.reacted;
  }
  hasDead(): boolean {
    return this.game?.camp.raid.some(r => this.isDead(r.character!) && r.isVisible) || this.currentEvent?.NPCs.some(n => this.isDead(n.character!) && n.isVisible) || false;
  }
  allRaidersDead(): boolean {
    return this.game?.camp.raid.every(r => this.isDead(r.character!)) ?? false;
  }
  hasTrader(): boolean {
    return this.currentEvent?.NPCs.some(npc => npc.attitude === 'neutral' && npc.isTrader && !this.isDead(npc.character!)) ?? false;
  }
  /* ------- */

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
          if (typeof id === 'string' && id.includes('-')) {
            this.selectNPC(id as string);
            return;
          } else if (!this.player) this.selectCurrentPlayer(id as string);
          else this.selectTarget(id as string);
        } else {
          this.selectTarget(id as string);
        }
    }
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
    if (this.noActionsLeft()) {
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
      this.actionForm.get('type')?.patchValue(ActionType.USEITEM);
      this.openSnackBar(`Tárgy kiválasztva: ${this.selectedItem?.name}`);
    }
  }
  selectWeapon(id: number) {
    if (!this.myTurn) {
      this.openSnackBar('Ezt csak a te körödben csinálhatod!');
      return;
    }
    if (this.player?.inCombat && localStorage.getItem('selectedWeapon' + this.player?.id)) {
      this.openSnackBar('Már van egy kiválasztott fegyvered!');
      return;
    }
    if (id === this.selectedWeapon?.id) {
      this.selectedWeapon = null;
      localStorage.removeItem('selectedWeapon' + this.player?.id);
      return;
    }
    this.selectedWeapon = this.myCharacterSpecs?.equipment.left.id === id ?
      this.myCharacterSpecs?.equipment.left : this.myCharacterSpecs?.equipment.right;
    localStorage.setItem('selectedWeapon' + this.player?.id, this.selectedWeapon?.id?.toString()!);
    this.openSnackBar(`${this.selectedWeapon?.name} kivlasztva.`);
  }
  selectTarget(target: string) {
    if (this.isReacting()) {
      const damage = this.attackActionIsPrimary ? this.game?.currentAction.primary.value : this.game?.currentAction.secondary.value;
      this.openSnackBar(`Reakció a támadásra (${this.game?.currentAction.performer.name} : -${damage} HP)`);
      return;
    }
    if (!this.myTurn) {
      this.openSnackBar('Ezt csak a te körödben csinálhatod!');
      return;
    }
    let newTarget;
    if (this.role === PlayerRole.PLAYER) {
      newTarget =
        this.currentEvent?.NPCs.find((n) => n.id === target) ??
        this.game?.camp?.raid.find(n => n.id === target) ??
        null;
    } else {
      newTarget = this.game?.players.find((p) => p.id === target) ?? null;
    }
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
  selectNPC(id: string) {
    if (this.role !== PlayerRole.HOST) {
      this.openSnackBar('Ehhez nincs jogosultságod!');
      return;
    }
    if (this.player?.id === id) {
      this.currentPlayer = this.player;
      this.player = null;
      this.selectedWeapon = null;
      return;
    }
    this.player = this.currentEvent?.NPCs.find((n) => n.id === id) ??
      this.game?.camp.raid.find(r => r.id === id)! ??
      this.raiders.find(r => r.id === id);
    if (this.player) {
      this.myTurn = this.player.id === this.game?.currentPlayer;
      this.setUpCharacterSpecs(this.player?.character!);
      const selectedWeaponId = localStorage.getItem('selectedWeapon' + this.player?.id);
      console.log(selectedWeaponId);
      if (selectedWeaponId) {
        if (this.myCharacterSpecs?.equipment.left.id?.toString() === selectedWeaponId) {
          this.selectedWeapon = this.myCharacterSpecs?.equipment.left
        } else if (this.myCharacterSpecs?.equipment.right.id?.toString() === selectedWeaponId) {
          this.selectedWeapon = this.myCharacterSpecs?.equipment.right;
        } else { this.selectedWeapon = null }
        console.log(this.selectedWeapon);
      }
      this.openSnackBar(`NPC kiválasztva: ${this.player?.name}`);
    }
  }
  selectCurrentPlayer(id: string) {
    if (this.role !== PlayerRole.HOST) {
      this.openSnackBar('Ehhez nincs jogosultságod!');
      return;
    }
    if (this.currentPlayer?.id === id) {
      if (!this.player && id.includes('-')) {
        this.player = this.currentPlayer;
        this.currentPlayer = null;
        return;
      }
      const gameCurrent = this.game?.players.find(p => p.id === this.game?.currentPlayer) ?? null;
      if (gameCurrent)
        this.currentPlayer = gameCurrent;
      return;
    }
    this.currentPlayer = this.game?.players.find((p) => p.id === id)!;
    this.player = null;
    if (this.currentPlayer) {
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
  checkReaction() {
    let checkedReactionStr = localStorage.getItem('checkedReaction' + this.player?.id);
    if (checkedReactionStr) this.checkedReaction = JSON.parse(checkedReactionStr);
    if (this.checkedReaction.primary && this.checkedReaction.secondary) return;
    let actions = [this.player?.lastAction?.primary, this.player?.lastAction?.secondary];
    actions.forEach(action => {
      if (action?.type !== ActionType.ATTACK) return;
      if (action === this.player?.lastAction?.primary) {
        if (!this.checkedReaction.primary) this.checkedReaction.primary = true;
        else return;
      }
      else if (action === this.player?.lastAction?.secondary) {
        if (!this.checkedReaction.secondary) this.checkedReaction.secondary = true;
        else return;
      }
      localStorage.setItem('checkedReaction' + this.player?.id, JSON.stringify(this.checkedReaction));
      if (this.player && action?.type === ActionType.ATTACK && action.reaction && action.reaction.reacted) {
        const target = this.game?.players.find(p => p.id === action.target) ??
          this.currentEvent?.NPCs.find(n => n.id === action.target) ??
          this.game?.camp.raid.find(r => r.id === action.target);
        const dmg = Math.max(0, action.value! - target?.character?.equipment.armour.defValue!);
        switch (action.reaction.reactionType) {
          case Reaction.NO_REACTION:
            this.openSnackBar(`${target?.name} nem reagált a támadásodra. ${dmg > 0 ? `-${dmg} HP sebzést szenvedett el.` : 'Nem szenvedett sebzést.'}`);
            break;
          case Reaction.DODGE:
            if (action.reaction.success)
              this.openSnackBar(`${target?.name} kikerülte a támadásodat! Nem szenvedett sebzést.`);
            else
              this.openSnackBar(`${target?.name} megpróbálta kikerülni a támadásodat, de nem sikerült. ${dmg > 0 ? `-${dmg} HP sebzést szenvedett el.` : 'Nem szenvedett sebzést.'}`);
            break;
          case Reaction.ATTACK_BACK:
            const counterDmg = Math.max(0, action.reaction.counterDamage! - this.player!.character?.equipment.armour.defValue!);
            this.openSnackBar(`${target?.name} visszatámadott. ${dmg > 0 ? `-${dmg} sebzést szenvedett el.` : 'Nem szenvedett sebzést.'}  ${counterDmg > 0 ? `Te elszenvedtél -${counterDmg} HP sebzést.` : 'Nem szenvedtél sebzést.'}`);
            break;
          case Reaction.PARRY:
            if (action.reaction.success) {
              const parryDmg = Math.max(0, action.reaction.counterDamage! - this.player!.character?.equipment.armour.defValue!);
              this.openSnackBar(`${target?.name} hárította a támadásodat! ${parryDmg > 0 ? `-${parryDmg} HP sebzést szenvedtél.` : 'Nem szenvedtél sebzést.'}`);
            } else if (action.reaction.success === false) {
              const parryFailDmg = Math.max(0, action.value! - target?.character?.equipment.armour.defValue!);
              this.openSnackBar(`${target?.name} megpróbálta hárítani a támadásodat, de nem sikerült. ${parryFailDmg > 0 ? `-${parryFailDmg} HP sebzést szenvedett el.` : 'Nem szenvedett sebzést.'}`);
            } else {
              this.openSnackBar(`${target?.name} megegyező értéket dobott veled. Nem történt sebzés.`)
            }
            break;
          default:
            this.openSnackBar('Ismeretlen reakció típus.');
            break;
        }
      }
    });
  }
  /* --------------- */

  async removeStatus() {
    try {
      this.isLoadingStatus = true;
      if (!this.selectedPlayerStatus) {
        this.openSnackBar('Válassz ki egy hatást a játékoson!');
        return;
      }
      const statusName = this.getStatusDetails(
        this.selectedPlayerStatus?.type!,
      ).name;
      let idx = this.currentPlayer?.character?.activeStatuses.findIndex(
        (s) => s.type === this.selectedPlayerStatus?.type,
      );
      if (idx === undefined || idx === -1) {
        this.openSnackBar('Nincs ilyen hatás a játékoson!');
        return;
      }
      this.currentPlayer?.character?.activeStatuses.splice(idx, 1);
      await this.gameService.updateGame(this.gameId, {
        players: this.game?.players,
      });
      this.openSnackBar(
        'Hatás sikeresen eltávolítva a játékosról: ' + statusName,
      );
      this.isLoadingStatus = false;
    } catch (error) {
      this.isLoadingStatus = false;
      console.error('Hiba a hatás eltávolításakor: ', error);
      this.openSnackBar(
        'Hiba a hatás eltávolításakor! További információ a konzolon.',
      );
      return;
    }
  }
  async addStatus() {
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
          (s) => s.type === newStatus.type,
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
      await this.gameService.updateGame(this.gameId, {
        players: this.game?.players,
        camp: this.game?.camp,
        adventure: this.game?.adventure,
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
        'Hiba a státus hozzáadásakor! További információ a konzolon.',
      );
      return;
    }
  }

  removeEffectFromItem(index: number) {
    const effectsArray = this.addItemForm.get('effects') as FormArray;
    effectsArray.removeAt(index);
  }
  addEffectToNewItem() {
    if (this.newItemEffectForm.invalid) {
      this.addItemError = 'Töltsd ki a kötelező mezőket.';
      return;
    }
    const value = this.newItemEffectForm.value;
    const effectsArray = this.addItemForm.get('effects') as FormArray;
    let effect: ItemEffect = {
      type: value.type,
      duration: value.duration,
      target: value.target
    }
    switch (value.type) {
      case EffectType.HEAL_HP:
      case EffectType.HEAL_SP:
      case EffectType.HEAL_SMALL_WOUND:
      case EffectType.HEAL_LARGE_WOUND:
        effect.value = value.value;
        break;
      case EffectType.BUFF_STAT:
        effect.stat = value.stat;
        break;
      case EffectType.ADD_STATUS:
      case EffectType.REMOVE_STATUS:
        if (value.type === EffectType.ADD_STATUS && ['BLEED', 'POISON', 'BURN'].includes(value.status)) effect.value = value.value;
        effect.status = value.status;
        break;
      default:
        break;
    }
    const isDuplicate = effectsArray.value.find((e: ItemEffect) => {
      if (e.type !== value.type || e.target !== value.target) return false;
      if (effect.stat) return e.stat === effect.stat;
      if (effect.status) return e.status === effect.status;
      return true;
    });
    if (isDuplicate) {
      this.addItemError = 'Ez a hatás már hozzá lett adva ugyanezzel a céllal.';
      return;
    }
    this.addItemError = '';
    effectsArray.push(this.fb.control(effect));
    this.newItemEffectForm.reset({
      type: EffectType.HEAL_HP,
      duration: 1,
      value: 1,
      target: 'self',
      stat: 'str',
      status: StatusType.BLEED,
    });
  }
  async AddNewItem() {
    try {
      const itemValue = this.addItemForm.value;
      console.log(itemValue);
      if (itemValue.existingItem) {
        const newItem: Item | Food | SpecialItem = {
          ...itemValue.existingItem,
        };
        if (newItem.type === ItemType.COMMON) {
          this.currentPlayer?.character?.items.generalItems.push(
            newItem as Item,
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
        if (this.raiders.some(r => r.id === this.currentPlayer?.id)) {
          localStorage.setItem('raiders', JSON.stringify(this.raiders));
          this.openSnackBar(`Tárgy hozzáadva: ${this.currentPlayer?.name}`);
          this.addItemForm.reset();
          this.isLoadingItem = false;
          this.addItemPanelVisible = false;
          return;
        }
        await this.gameService.updateGame(this.gameId, {
          players: this.game?.players,
          camp: this.game?.camp,
          adventure: this.game?.adventure
        });
        this.addItemForm.reset({
          existingItem: '',
          newItemName: '',
          newItemDesc: '',
          newItemEffectDesc: '',
          newItemUses: 1,
          hasEffect: false
        });
        this.isLoadingItem = false;
        this.addItemPanelVisible = false;
      } else {
        if (!itemValue.name) {
          this.addItemError = 'Adj nevet a tárgynak!';
          return;
        }
        if (!itemValue.type) {
          this.addItemError = 'Válassz egy típust!';
          return;
        }
        if (!itemValue.uses || itemValue.uses <= 0) {
          this.addItemError = 'Adj meg érvényes mennyiséget!';
          return;
        }
        if (itemValue.effects.length === 0) {
          this.addItemError = 'Adj hozzá legalább egy hatást a tárgyhoz!';
          return;
        }
        this.isLoadingItem = true;
        const highestID = this.myCharacterSpecs?.items.food.concat(
          this.myCharacterSpecs?.items.specialItems,
          this.myCharacterSpecs?.items.generalItems,
        ).reduce((max, item) => (item.id !== undefined && item.id > max ? item.id : max), 0);
        let newItem: Item | Food | SpecialItem | Cigar = {
          id: this.itemService.generateNewItemID(highestID),
          name: itemValue.name ?? '',
          desc: itemValue.desc ?? '',
          size: ItemSize.NORMAL,
          type: itemValue.type ?? '',
          category: ItemCategory.CONSUMABLE,
          uses: itemValue.uses ?? 1,
          effects: itemValue.effects ?? [],
        };
        if (
          newItem.type === ItemType.MEDICAL ||
          newItem.type == ItemType.SPECIAL
        ) {
          if (!itemValue.effectDesc) {
            this.addItemError = 'Adj hatás leírást! Pl.: Gyógyulsz 2 HP-t.';
            this.isLoadingItem = false;
            return;
          }
          (newItem as any).effectDesc = itemValue.effectDesc ?? '';
        }
        const items: Food[] | SpecialItem[] | Item[] | (Weapon | Armour)[] =
          newItem.type === ItemType.FOOD
            ? this.currentPlayer?.character?.items.food!
            : this.currentPlayer?.character?.items.specialItems!;
        const existingItem = items.find((i) => i.id === newItem.id)!;
        if (!existingItem) {
          items.push({ ...newItem } as any);
        } else {
          existingItem.uses! += newItem.uses!;
        }
        await this.gameService.updateGame(this.gameId, {
          players: this.game?.players,
          camp: this.game?.camp,
          adventure: this.game?.adventure
        });
        this.openSnackBar(
          `Tárgy hozzáadva ${this.currentPlayer?.name}-hez: ${newItem.name}`,
        );
        this.addItemForm.reset({
          name: '',
          desc: '',
          type: ItemType.FOOD,
          effectDesc: '',
          uses: 1,
          hasEffect: false,
          isPartyWide: false,
          combat: false,
          color: '',
          spice: '',
        });
        this.isLoadingItem = false;
        this.addItemPanelVisible = false;
      }
    } catch (error) {
      console.error('Hiba az új tárgy létrehozásakor: ', error);
      this.isLoadingItem = false;
      this.addItemError = 'Hiba az új tárgy hozzáadásakor.';
      return;
    }
  }

  addRaider() {
    if (this.addRaiderForm.invalid) {
      this.openSnackBar('Töltsd ki a kötelező mezőket!');
      return;
    }
    const id = `raider-${Date.now()}`
    let raiderChar = createCharacter(this.addRaiderForm, this.itemService, id, this.game?.ownerId);
    let raider: NPC = {
      id: id,
      name: raiderChar.name,
      attitude: 'hostile',
      character: raiderChar,
      actionsLeft: { primary: true, secondary: true },
      initiative: null,
      inCombat: true,
      isTrader: false,
      isVisible: this.addRaiderForm.value.isVisible ?? true,
      lastAction: { performer: { id: '', name: '' }, primary: {} as GameAction, secondary: {} as GameAction }
    }
    this.addRaiderPanelVisible = false;
    this.raiders.push(raider);
    localStorage.setItem('raiders', JSON.stringify(this.raiders))
  }
  removeRaider(id: string) {
    if (this.role !== PlayerRole.HOST) throw new Error('Nincs ehhez jogosultságod!');
    this.raiders = this.raiders.filter(r => r.id !== id);
    if (this.raiders.length) localStorage.setItem('raiders', JSON.stringify(this.raiders))
    else localStorage.removeItem('raiders')
  }

  async publishRaiders() {
    try {
      const updatedCamp = {
        ...this.game?.camp!,
        raid: this.raiders,
      }
      this.game?.players.forEach(p => p.inCombat = true)
      this.raiders.forEach(r => this.game?.playerOrder.push({
        id: r.id, initiative: Math.ceil(Math.random() * 20), finished: false
      }))
      this.game?.playerOrder.sort((a, b) => b.initiative - a.initiative);
      await this.gameService.updateGame(this.gameId, {
        camp: updatedCamp, players: this.game?.players, playerOrder: this.game?.playerOrder
      })
      this.canPublishRaiders = false;
      localStorage.removeItem('raiders');
      localStorage.removeItem('campCheckRoll');
      this.playersFinishedCampActions = false;
      this.startNewTurn()
    } catch (error) {
      console.error('Hiba a rajtaütők feltöltésekor: ', error);
      this.openSnackBar('Hiba a feltöltéskor!')
      return;
    }
  }
  /**
   * Ellenőrzi, hogy a játékosnak van-e még akciója, figyelembe véve a táborozás mechanikáját és a rajtaütést.
   */
  noActionsLeft(): boolean {
    if (this.game?.camp.isCamping && 'campActionPoints' in this.player! && !this.isRaid()) {
      return this.player.campActionPoints <= 0;
    }
    return (
      !this.player?.actionsLeft.primary && !this.player?.actionsLeft.secondary
    );
  }

  /* GAME MECHANICS */
  async performAction() {
    try {
      if (this.actionForm.invalid) {
        this.actionError = 'Töltsd ki a kötelező mezőket!';
        return;
      }
      if ('isVisible' in this.player! && !this.player.isVisible) {
        this.openSnackBar('Rejtett karakterrel nem hajthatsz végre akciót!');
        return;
      }
      if (this.player && this.noActionsLeft()) {
        this.openSnackBar('Nincs több akciód!');
        return;
      }
      this.isPerformingAction = true;
      this.actionPanelVisible = false;
      const formValue = this.actionForm.value;
      const isPrimary: boolean = formValue.isPrimary ?? false;
      switch (formValue.type) {
        /* Regural */
        case ActionType.USEITEM:
        case StandardCampActions.TREAT_WOUNDS:
          if (formValue.item === undefined || formValue.item === '') {
            throw new Error('Nincs kiválasztva tárgy!');
          }
          await this.useItem(isPrimary);
          break;
        case ActionType.CAMP:
          await this.askForCamp(isPrimary);
          break;
        case ActionType.ATTACK:
          await this.attack(isPrimary);
          break;
        case ActionType.LOOT:
          if (isPrimary && !this.player?.actionsLeft.primary) {
            throw new Error('Nincs elsődleges akciód!');
          } else if (!isPrimary && !this.player?.actionsLeft.secondary) {
            throw new Error('Nincs másodlagos akciód!');
          }
          const target = this.game?.camp.raid.find(r => r.id === formValue.target) ??
            this.currentEvent?.NPCs.find(n => n.id === formValue.target);
          if (!target) throw new Error('Válassz egy célpontot a kifosztáshoz!');
          if (!this.isDead(target?.character!)) {
            throw new Error('Csak halott célpontot lehet kifosztani!');
          }
          Object.values(target?.character?.items!).forEach(itemArray => {
            itemArray.forEach(item => {
              this.loot.push(item);
            });
          });
          if (this.loot.length === 0) {
            throw new Error('Nincs mit kifosztani a célponttól!');
          }
          localStorage.setItem('actionIsPrimary', isPrimary.toString());
          this.lootPanelVisible = true;
          break;
        case ActionType.TRADE:
          if (!this.selectedTarget) {
            throw new Error('Nincs kiválasztva kereskedő.');
          }
          if (this.isDead(this.selectedTarget.character!)) {
            throw new Error('A célpont halott. Nem lehet kereskedni vele.');
          }
          if (!('isTrader' in this.selectedTarget) || !this.selectedTarget.isTrader) {
            throw new Error('A kiválasztott célpont nem kereskedő.');
          }
          if (isPrimary && !this.player?.actionsLeft.primary) {
            throw new Error('Nincs elsődleges akciód!');
          } else if (!isPrimary && !this.player?.actionsLeft.secondary) {
            throw new Error('Nincs másodlagos akciód!');
          }
          localStorage.setItem('actionIsPrimary', isPrimary.toString());
          this.tradePanelVisible = true;
          break;
        /* Camping */
        case MandatoryCampActions.START_FIRES:
        case MandatoryCampActions.SET_UP_TENTS:
        case MandatoryCampActions.SET_UP_TRAPS:
        case MandatoryCampActions.GUARD:
          await this.performMandatoryCampAction(formValue.type, formValue.customCA);
          break;
        case StandardCampActions.CALM_OTHERS:
        case StandardCampActions.GATHER_PLANTS:
        case StandardCampActions.HUNT:
          await this.performStandardCampAction(formValue.type, formValue.caSubType);
          break;
        default:
          this.actionError = 'Ismeretlen akció típus!';
          return;
      }
      this.actionForm.reset({
        subType: '',
      }, { emitEvent: false });
      this.isPerformingAction = false;
      this.actionPanelVisible = false;
    } catch (error: any) {
      if (error.cause !== GameErrorCauses.GameUpdateError) this.openSnackBar(error.message);
      this.isPerformingAction = false;
      this.actionPanelVisible = true;
      return;
    }
  }
  manageActions(isPrimary: boolean, type: ActionType | MandatoryCampActions | StandardCampActions) {
    const itemName = this.selectedItem?.name || 'Ismeretlen tárgy';
    if (this.player) {
      if (
        !this.player.lastAction.performer.id &&
        !this.player.lastAction.performer.name
      ) {
        this.player.lastAction.performer = {
          id: this.player.id,
          name: this.player.name,
        };
      }
      switch (type) {
        case ActionType.USEITEM:
          if (this.game?.camp.isCamping && 'campActionPoints' in this.player && !this.isRaid()) {
            this.player.campActionPoints -= 1;
          } else if (isPrimary) {
            this.player.lastAction.primary = {
              type: type,
              item: itemName,
            };
          } else {
            this.player.lastAction.secondary = {
              type: type,
              item: itemName,
            };
          }
          break;
        case ActionType.ATTACK:
          if (isPrimary) {
            this.player.lastAction.primary = {
              type: type,
              target: this.selectedTarget?.id,
              value: this.lastRoll,
              reaction: { reacted: false },
            };
          } else {
            this.player.lastAction.secondary = {
              type: type,
              target: this.selectedTarget?.id,
              value: this.lastRoll,
              reaction: { reacted: false },
            };
          }
          break;
        case ActionType.LOOT:
        case ActionType.TRADE:
          if (isPrimary) {
            this.player.lastAction.primary = {
              type: type,
              target: this.selectedTarget?.id,
            };
          } else {
            this.player.lastAction.secondary = {
              type: type,
              target: this.selectedTarget?.id,
            };
          }
          break;
        case ActionType.CAMP:
          if (isPrimary) {
            this.player.lastAction.primary = {
              type: type,
            };
          } else {
            this.player.lastAction.secondary = {
              type: type,
            };
          }
          break;
      }
      if ((!this.game?.camp.isCamping || this.isRaid()) && isPrimary) {
        this.player.actionsLeft.primary = false;
      } else if ((!this.game?.camp.isCamping || this.isRaid()) && !isPrimary) {
        this.player.actionsLeft.secondary = false;
      }
      this.game!.currentAction = this.player?.lastAction;
    }
  }
  async useItem(isPrimary: boolean) {
    if (this.player) {
      if (!this.selectedItem) throw new Error('Nincs kiválasztva tárgy!');
      if (this.selectedItem?.type === ItemType.FOOD && !this.game?.camp.isCamping) {
        throw new Error('Csak táborozás közben fogyasztható ez a tárgy!');
      }
      if ((!this.game?.camp.isCamping || this.isRaid()) && isPrimary && !this.player.actionsLeft.primary) {
        throw new Error('Nincs elsődleges akciód!');
      } else if ((!this.game?.camp.isCamping || this.isRaid()) && !isPrimary && !this.player.actionsLeft.secondary) {
        throw new Error('Nincs másodlagos akciód!');
      }
      switch (this.selectedItem?.category) {
        case ItemCategory.CONSUMABLE:
          try {
            const itemName = this.selectedItem?.name || 'Ismeretlen tárgy';
            this.selectedItem?.effects?.forEach((effect) => {
              this.applyItemEffect(effect);
            });
            await this.manageItemUses(isPrimary);
            this.openSnackBar(`Tárgy használva: ${itemName}`);
            this.actionPanelVisible = false;
            this.actionForm.reset({
              type: '',
              item: '',
            });
          } catch (error: any) {
            console.error(error);
            throw error;
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
  async manageItemUses(isPrimary: boolean) {
    try {
      if (this.player && this.selectedItem) {
        if (this.selectedItem && 'uses' in this.selectedItem && this.selectedItem.uses && this.selectedItem.uses > 0) {
          this.selectedItem.uses -= 1;
          if (this.selectedItem.uses === 0) {
            const index = this.currentInventory.findIndex(
              (i) => i.id === this.selectedItem!.id,
            );
            if (index > -1) {
              this.currentInventory.splice(index, 1);
            }
          }
          this.manageActions(isPrimary, ActionType.USEITEM);
          if (this.role === PlayerRole.HOST) {
            this.currentEvent!.NPCs = this.currentEvent?.NPCs.map((p) =>
              p.id === this.player?.id ? (this.player! as NPC) : p,
            )!;
            await this.gameService.updateGame(this.gameId, {
              adventure: this.game?.adventure,
              camp: this.game?.camp,
              currentAction: this.game?.currentAction,
            });
          } else {
            const updatedPlayers = this.game!.players.map((p) =>
              p.id === this.player?.id ? (this.player! as Player) : p,
            );
            await this.gameService.updateGame(this.gameId, {
              players: updatedPlayers,
              currentAction: this.game?.currentAction,
            });
          }
        }
      }
    } catch (error) {
      console.error('Hiba a tárgy kezelésekor: ', error);
      this.openSnackBar('Hiba a tárgy kezelésekor! További információ a konzolon.');
      return;
    }
  }
  applyItemEffect(effect: ItemEffect, partyWide: boolean = false, teamTarget: Player | null = null) {
    const target = effect.target === 'self' ? this.player : effect.target === 'target' ? this.selectedTarget : partyWide ? teamTarget : 'party';
    if (target && target !== 'party' && target.character) {
      let statusEffects = target.character.activeStatuses ?? [];
      let newStatus: ActiveStatus | undefined = undefined;
      switch (effect.type) {
        case EffectType.HEAL_HP:
          if (
            target.character.stats.main.hp < target.character.stats.main.maxHP
          ) {
            target.character.stats.main.hp = Math.min(
              target.character.stats.main.hp + effect.value!,
              target.character.stats.main.maxHP,
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
              target.character.stats.main.maxSP,
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
              target.character.wounds.small - effect.value!,
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
              target.character.wounds.large - effect.value!,
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
            },
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
              `Nem lehetséges a hatás hozzáadása. Már van ilyen hatás a karakteren: ${this.getStatusDetails(effect.status!).name
              }`,
              { cause: GameErrorCauses.NoStatusToAdd },
            );
          } else {
            Object.values(this.player?.character?.activeStatuses!).forEach(
              (s) => {
                if (s.type === newStatus?.type) {
                  s.duration += newStatus.duration;
                }
              },
            );
          }
          break;
        case EffectType.REMOVE_STATUS:
          newStatus = statusEffects.find((s) => s.type === effect.status);
          if (newStatus) {
            statusEffects = statusEffects.filter(
              (s) => s.type !== newStatus?.type,
            );
            target.character.activeStatuses = statusEffects;
            break;
          }
          if (this.selectedItem?.effects?.length === 1) {
            throw new Error(
              'Nem lehetséges a hatás levétele. Nincs ilyen hatás: ' +
              this.getStatusDetails(effect.status!).name,
              { cause: GameErrorCauses.NoStatusToRemove },
            );
          } else {
            this.openSnackBar(
              `Nem lehetséges a hatás levétele. Nincs ilyen hatás: ${this.getStatusDetails(effect.status!).name
              }`,
            );
          }
          break;
      }
    } else if (target === 'party') {
      this.game?.players.forEach(p => {
        this.applyItemEffect(effect, true, p)
      })
    }
  }

  evaluateVote(): boolean {
    let y = 0, n = 0;
    this.game?.vote.votes.forEach(v => {
      if (v.vote) y += 1;
      else n += 1;
    })
    return y > n;
  }
  async vote(vote: boolean) {
    try {
      let playerVote = this.game?.vote.votes?.find(v => v.player === this.player?.name)
      if (playerVote && (!playerVote.vote && playerVote.vote !== false)) {
        playerVote.vote = vote;
      } else {
        this.game?.vote.votes.push({ player: this.player?.name!, vote: vote })
      }
      await this.gameService.updateGame(this.gameId, { vote: this.game?.vote })
    } catch (error) {
      console.error('Hiba szavazáskor: ' + error);
      this.openSnackBar('Hiba szavazáskor!');
      return;
    }
  }
  async askForCamp(isPrimary: boolean) {
    if(isPrimary && this.player?.actionsLeft.primary === false) {
      throw new Error('Nincs elsődleges akciód!');
    }
    if(!isPrimary && this.player?.actionsLeft.secondary === false) {
      throw new Error('Nincs másodlagos akciód!');
    }
    if (this.game?.players.some(p => p.inCombat)) {
      throw new Error('Nem kezdeményezhető táborozás harc közben!');
      }
    try {
      if (this.game?.players.length === 1) {
        this.game.camp.isCamping = true;
        this.calculateCampActions();
        await this.startNewTurn();
        this.actionPanelVisible = false;
        return;
      }
      this.game?.players.forEach(p => p.isVoting = true)
      this.manageActions(isPrimary, ActionType.CAMP);
        await this.gameService.updateGame(this.gameId,
          {
            vote: { theme: 'Táborozás', starter: this.player?.name!, votes: [
              {
                player: this.player?.name!,
                vote: true,
              }
            ] },
            players: this.game?.players
          }
      )
      this.actionPanelVisible = false;
    } catch (error) {
      console.error('Hiba a táborozás kezdeményezésekor: ' + error);
      this.openSnackBar('Hiba a táborozás kezdeményezésekor!');
      return;
    }
  }
  async checkCamp() {
    if (this.game?.camp.raid.every(r => r.character?.activeStatuses.some(s => s.type === StatusType.DEAD)) && this.game?.camp.raid.length > 0) {
      await this.finishCamping();
      return;
    }
    if (this.game?.playerOrder.some(i => !i.finished)) {
      this.openSnackBar('Nem minden játékos végzet!')
      return;
    }
    const prevCheckStr = localStorage.getItem('campCheckRoll');
    let prevCheck = 0;
    if (prevCheckStr) {
      prevCheck = parseInt(prevCheckStr);
    }
    let notDone = [];
    if (this.game?.camp.campActions.fire! < this.campActionCosts.fire) notDone.push(1);
    if (this.game?.camp.campActions.tents! < this.campActionCosts.tents) notDone.push(2);
    if (this.game?.camp.campActions.traps! < this.campActionCosts.traps) notDone.push(3);
    if (this.game?.camp.campActions.guard! < this.campActionCosts.guard) notDone.push(4);
    if (prevCheck) {
      if (this.raiders.length === 0) {
        this.openSnackBar('Nincsenek rajtaütő NPC-k! Adj meg legalább egyet.')
        return;
      }
      this.openSnackBar('Rajtaütés');
      this.canPublishRaiders = true;
      return;
    }
    if (notDone.length > 0) {
      await this.openDiceRoller(['d4']);
      if (notDone.includes(this.lastRoll)) {
        if (this.raiders.length === 0) {
          this.openSnackBar('Nincsenek rajtaütő NPC-k! Adj meg legalább egyet.')
          localStorage.setItem('campCheckRoll', `${this.lastRoll}`)
          return;
        }
        this.openSnackBar('Rajtaütés');
        this.canPublishRaiders = true;
        return;
      }
    }
    localStorage.removeItem('campCheckRoll');
    await this.finishCamping().catch(error => {
      console.error('Hiba a táborozás lezárásakor: ', error);
      this.openSnackBar('Hiba a táborozás lezárásakor.');
    })

  }
  async finishCamping() {
    try {
      this.game?.players.forEach((p) => {
        if (p.inCombat) p.inCombat = false;
        p.character.activeStatuses = p.character.activeStatuses?.filter(s=>[StatusType.DEAD, StatusType.INSANE, StatusType.PROSTHETIC].includes(s.type)) ?? [];
      });
      this.game!.playerOrder! = this.game?.playerOrder.filter(po => this.game?.players.some(p => p.id === po.id)) ?? [];
      this.game!.camp.isCamping = false;
      this.game!.camp.raid = [];
      this.game!.camp.campActions = {
        fire: 0,
        tents: 0,
        traps: 0,
        guard: 0,
      }
      await this.gameService.updateGame(this.gameId, {
        camp: this.game?.camp,
        players: this.game?.players,
        playerOrder: this.game?.playerOrder
      });
      await this.startNewTurn();
    } catch (error) {
      throw error;
    }
  }

  lootItem(type: 'loot' | 'putback', item: Item | Food | SpecialItem) {
    if (type === 'loot') {
      this.loot = this.loot.filter(i => i.id !== item.id);
      this.looted.push({ ...item });
    } else if (type === 'putback') {
      this.looted = this.looted.filter(i => i.id !== item.id);
      this.loot.push({ ...item });
    }
  }
  async finishLooting() {
    try {
      if (this.looted.length === 0) {
        throw new Error('Nincs tárgy a zsákmányban! Legalább egy tárgyat válassz ki.');
      }
      let isPrimary: string | boolean | null = localStorage.getItem('actionIsPrimary');
      if (isPrimary === null || isPrimary === undefined) {
        throw new Error('Hiba a kereskedés során. Próbáld újra!', { cause: 'NoSavedIsPrimaryVariable' });
      }
      isPrimary = isPrimary === 'true';
      localStorage.removeItem('actionIsPrimary');
      this.manageActions(isPrimary, ActionType.LOOT);
      let items: Food[] | SpecialItem[] | (Inventory | Item)[] = [];
      let targetItems: Food[] | SpecialItem[] | (Inventory | Item)[] = [];
      this.looted.forEach(item => {
        switch (item.type) {
          case ItemType.COMMON:
            items = this.player?.character?.items.generalItems!;
            targetItems =
              this.currentEvent?.NPCs.find(n => n.id === this.selectedTarget?.id)?.character?.items.generalItems! ??
              this.game?.camp.raid.find(r => r.id === this.selectedTarget?.id)?.character?.items.generalItems!;
            break;
          case ItemType.FOOD:
            items = this.player?.character?.items.food!;
            targetItems =
              this.currentEvent?.NPCs.find(n => n.id === this.selectedTarget?.id)?.character?.items.food! ??
              this.game?.camp.raid.find(r => r.id === this.selectedTarget?.id)?.character?.items.food!;
            break;
          case ItemType.SPECIAL:
          case ItemType.MEDICAL:
            items = this.player?.character?.items.specialItems!;
            targetItems =
              this.currentEvent?.NPCs.find(n => n.id === this.selectedTarget?.id)?.character?.items.specialItems! ??
              this.game?.camp.raid.find(r => r.id === this.selectedTarget?.id)?.character?.items.specialItems!;
            break;
        }
        const existingItem = items.find(i => i.id === item.id);
        if (existingItem) {
          if ('uses' in item && 'uses' in existingItem) {
            existingItem.uses! += item.uses!;
          }
        } else {
          items.push({ ...item } as any);
        }
        const indexToRemove = targetItems.findIndex(i => i.id === item.id);
        if (indexToRemove > -1) {
          targetItems.splice(indexToRemove, 1);
        }
      })
      await this.gameService.updateGame(this.gameId, {
        players: this.game?.players,
        currentAction: this.game?.currentAction,
        adventure: this.game?.adventure,
      });
      this.openSnackBar('Sikeres zsákmányolás!');
      this.lootPanelVisible = false;
      this.looted = [];
      this.loot = [];
    } catch (error: any) {
      if (error.cause === 'NoSavedIsPrimaryVariable') {
        this.showPanel('loot', null, true);
      }
      console.error('Hiba a zsákmány befejezésekor: ' + error);
      if (error.cause !== GameErrorCauses.GameUpdateError) this.openSnackBar(error.message);
      return;
    }
  }
  addToTrade(type: 'buy' | 'sell', action: 'add' | 'remove', item: Food | SpecialItem | Item, moveAll: boolean = false) {
    let itemsArray = type === 'buy' ? this.itemsToBuy : this.itemsToSell;
    let originalItem;
    const existingItem = itemsArray.find(i => i.id === item.id);
    if (action === 'add') {
      if (type === 'buy') {
        if ('trades' in this.selectedTarget!) {
          originalItem = this.selectedTarget?.trades!['foods']
            .concat(this.selectedTarget?.trades!['specialDrinks'])
            .concat(this.selectedTarget?.trades!['medicalItems'])
            .concat(this.selectedTarget?.trades!['cigars']).find(i => i.item.id! === item.id)
          if (originalItem && originalItem.pieces <= 0) {
            this.openSnackBar('Nincs több darab a kereskedőnél ebből a tárgyból.');
            return;
          }
        }
        if (existingItem && 'uses' in existingItem) {
          let uses = 0;
          if (!originalItem) {
            uses = 1;
          }
          if (originalItem && 'uses' in originalItem.item) {
            existingItem.uses! += originalItem.item.uses! ?? uses;
            originalItem.pieces -= 1;
            (existingItem as any).buyAmount += 1;
          }
        } else {
          itemsArray.push({ ...item, buyAmount: 1 } as any);
          if (originalItem) originalItem.pieces -= 1;
        }
        this.totalPrice += item.price!;
      } else if (type === 'sell') {
        let tradeGroup = '';
        switch (item.type) {
          case ItemType.FOOD:
            tradeGroup = 'foods';
            break;
          case ItemType.SPECIAL:
            tradeGroup = 'specialDrinks';
            break;
          case ItemType.MEDICAL:
            tradeGroup = 'medicalItems';
            break;
          case ItemType.CIGAR:
            tradeGroup = 'cigars';
            break;
        }
        const cantSell = (this.selectedTarget as any).trades[tradeGroup].length === 0;
        if (cantSell) {
          this.openSnackBar('A kereskedő nem vásárol ilyen típusú tárgyakat.');
          return;
        }
        const originalItemInInventory =
          this.myCharacterSpecs?.items.food.concat(this.myCharacterSpecs?.items.specialItems)
            .find(i => i.id === item.id);
        if (!originalItemInInventory) {
          this.openSnackBar('A tárgy nem található a karaktered tárgyai között.');
          return;
        }
        originalItem = this.itemService.getAllItems().find(i => i.id === item.id) ??
          this.myCharacterSpecs?.items.food.find(i => i.id === item.id) ??
          this.myCharacterSpecs?.items.specialItems.find(i => i.id === item.id);
        let uses = 0;
        if (!originalItem) {
          uses = 1;
        }
        if (existingItem && 'uses' in existingItem && originalItem) {
          existingItem.uses! += originalItem.uses! ?? uses;
          (existingItem as any).sellAmount += 1;
        } else {
          itemsArray.push({ ...originalItem, sellAmount: 1 } as any);
        }
        originalItemInInventory.uses! -= originalItem?.uses! ?? uses;
        if (originalItemInInventory.uses! <= 0) {
          const originalArray = originalItemInInventory.type === ItemType.FOOD ?
            this.myCharacterSpecs?.items.food :
            this.myCharacterSpecs?.items.specialItems;
          originalArray?.splice(originalArray.findIndex(i => i.id === originalItemInInventory.id), 1);
        }
        this.totalSell += item.price!;
      }
    } else {
      if (type === 'buy') {
        if (existingItem && 'uses' in existingItem) {
          if ('trades' in this.selectedTarget!) {
            originalItem = this.selectedTarget?.trades!['foods']
              .concat(this.selectedTarget?.trades!['specialDrinks'])
              .concat(this.selectedTarget?.trades!['medicalItems'])
              .concat(this.selectedTarget?.trades!['cigars']).find(i => i.item.id! === item.id)
          }
          let uses = 0;
          if (!originalItem) {
            uses = 1;
          } if (moveAll) {
            if (existingItem && 'buyAmount' in existingItem && originalItem) {
              const amountToRemove = existingItem.buyAmount! as number;
              existingItem.uses! -= (originalItem?.item.uses! ?? uses) * amountToRemove;
              originalItem.pieces += amountToRemove;
              this.totalPrice -= item.price! * amountToRemove;
            }
            return;
          } else if (originalItem && 'uses' in originalItem.item) {
            existingItem.uses! -= originalItem.item.uses! ?? uses;
            (existingItem as any).buyAmount! -= 1;
            originalItem.pieces += 1;
          }
          if (existingItem.uses! <= 0) {
            this.itemsToBuy = this.itemsToBuy.filter(i => i.id !== existingItem!.id);
          }
          this.totalPrice -= item.price!;
        } else {
          this.openSnackBar('A tárgy nincs a vásárolt tárgyak között.');
          return;
        }

      } else if (type === 'sell') {
        const originalItemInInventory = this.myCharacterSpecs?.items.food.concat(this.myCharacterSpecs?.items.specialItems)
          .find(i => i.id === item.id);
        originalItem = this.itemService.getAllItems().find(i => i.id === item.id) ??
          this.myCharacterSpecs?.items.food.find(i => i.id === item.id) ??
          this.myCharacterSpecs?.items.specialItems.find(i => i.id === item.id);
        let uses = 0;
        if (!originalItem) {
          uses = 1;
        }
        if (moveAll) {
          if (existingItem && 'sellAmount' in existingItem) {
            const amountToRemove = existingItem.sellAmount! as number;
            if (originalItemInInventory)
              originalItemInInventory!.uses! += (originalItem?.uses! ?? uses) * amountToRemove;
            else {
              const originalArray = item.type === ItemType.FOOD ?
                this.myCharacterSpecs?.items.food :
                this.myCharacterSpecs?.items.specialItems;
              originalArray?.push({ ...originalItem, uses: (originalItem?.uses! ?? uses) * amountToRemove } as any);
            }
            this.totalSell -= item.price! * amountToRemove;
            return;
          }
        } else if (existingItem && 'uses' in existingItem) {
          existingItem.uses! -= originalItem?.uses! ?? uses;
          (existingItem as any).sellAmount! -= 1;
          if (existingItem.uses! <= 0) {
            this.itemsToSell = this.itemsToSell.filter(i => i.id !== existingItem!.id);
          }
        }
        const originalArray = item.type === ItemType.FOOD ?
          this.myCharacterSpecs?.items.food :
          this.myCharacterSpecs?.items.specialItems;
        if (originalItemInInventory) {
          originalItemInInventory.uses! += originalItem?.uses! ?? uses;
        } else {
          originalArray?.push({ ...originalItem } as any);
        }
        this.totalSell -= item.price!;
      }
    }
  }
  async tradeItems() {
    try {
      let isPrimary: string | boolean | null = localStorage.getItem('actionIsPrimary');
      if (isPrimary === null || isPrimary === undefined) {
        throw new Error('Hiba a kereskedés során. Próbáld újra!', { cause: 'NoSavedIsPrimaryVariable' });
      }
      isPrimary = isPrimary === 'true';
      const character = this.player?.character;
      if (!character) return;
      if (this.itemsToSell.length > 0) {
        this.itemsToSell.forEach(item => {
          character.coins += item.price! * (item as any).sellAmount!;
        })
        this.totalSell = 0
        this.itemsToSell = [];
      }
      if (character.coins < this.totalPrice) {
        throw new Error('Nincs elég pénzed a vásárláshoz!');
      }
      character.coins -= this.totalPrice;
      this.itemsToBuy.forEach(item => {
        const itemsArray = item.type === ItemType.FOOD ?
          this.myCharacterSpecs?.items.food :
          this.myCharacterSpecs?.items.specialItems!;
        const existingItem = itemsArray?.find(i => i.id === item.id);
        if (existingItem && 'uses' in existingItem) {
          existingItem.uses! += item.uses!;
        } else {
          itemsArray?.push({ ...item } as Omit<Item, 'buyAmount' | 'sellAmount'> as any);
        }
      });
      this.totalPrice = 0;
      this.itemsToBuy = [];
      this.manageActions(isPrimary, ActionType.TRADE);
      await this.gameService.updateGame(this.gameId, {
        players: this.game?.players,
        currentAction: this.game?.currentAction,
        adventure: this.game?.adventure,
      });
      localStorage.removeItem('actionIsPrimary');
      this.showPanel('trade', null, false);
    } catch (error: any) {
      if (error.cause === 'NoSavedIsPrimaryVariable') {
        this.showPanel('trade', null, false);
      }
      console.error('Hiba a kereskedés befejezésekor: ' + error);
      if (error.cause !== GameErrorCauses.GameUpdateError) this.openSnackBar(error.message);
      return;
    }
  }

  async manageDeathAndInsane(type: 'death' | 'insane', target: Player | NPC) {
    let status!: ActiveStatus;
    if (type === 'death') {
      target.character!.stats.main.hp = 0;
      target.character!.wounds.large += 1;
      target.character!.activeStatuses = [];
      status = {
        type: StatusType.DEAD,
        duration: 9999,
      };
    } else if (type === 'insane') {
      target.character!.stats.main.sp = 0;
      status = {
        type: StatusType.INSANE,
        duration: 9999,
      };
    }
    if (status) target.character!.activeStatuses.push(status);
    target.inCombat = false;
    this.game!.playerOrder = this.game?.playerOrder.filter(po => po.id !== target.id) ?? [];

    let combatEnded = true;
    this.game!.playerOrder.forEach(po => {
      const gameMember = this.currentEvent?.NPCs.find(p => p.id === po.id) ??
        this.game?.camp.raid.find(r => r.id === po.id) ??
        this.game?.players.find(p => p.id === po.id) ?? null;
      if (gameMember && gameMember.inCombat) combatEnded = false;
    });

    if (combatEnded) {
      this.game?.players.forEach(p => p.inCombat = false);
    }
    try {
      await this.gameService.updateGame(this.gameId, {
        players: this.game?.players,
        camp: this.game?.camp,
        playerOrder: this.game?.playerOrder,
        adventure: this.game?.adventure,
        currentAction: this.game?.currentAction,
        currentPlayer: this.game?.currentPlayer,
      });
    } catch (err) {
      console.error('Hiba a halál/megőrülés kezelése után a mentéskor: ', err);
    }
  }
  async rollForWound(character: Character, target: Player | NPC) {
    this.openSnackBar(`${target.name} HP-ja 0-ra csökkent. Dobás a sérülés típusára!`);
    await this.openDiceRoller(['d6']);
    const woundType = () => { return this.lastRoll <= 4 ? 's' : 'l' }
    if (woundType() === 's' && character?.wounds.small! < 2) {
      this.openSnackBar(`${target.name} egy kis sérülést szenvedett el.`)
      character.wounds.small += 1;
      character.stats.main.hp = character.stats.main.maxHP;
      return;
    }
    else if (woundType() === 'l' || character.wounds.small! === 2) {
      if (character?.wounds.large! < 2) {
        if (character.wounds.small! === 2 && woundType() === 's') character.wounds.small = 0;
        this.openSnackBar(`${target.name} egy nagy sérülést szenvedett el.`);
        const wound: ActiveStatus = {
          type: StatusType.LOST_LIMB,
          duration: 9999,
        };
        character?.activeStatuses.push(wound);
        character.wounds.large += 1;
        character.stats.main.hp = character.stats.main.maxHP;
        const limbsLost = character?.activeStatuses.filter(s => s.type === StatusType.LOST_LIMB).length ?? 0;
        if (limbsLost === 1) {
          target.actionsLeft = { primary: target.actionsLeft.primary, secondary: false };
        } else if (limbsLost >= 2) {
          target.actionsLeft = { primary: false, secondary: false };
        }
        return;
      } else {
        this.openSnackBar(`${target.name} túl sok sérülést szenvedett el, ezért meghalt.`);
        await this.manageDeathAndInsane('death', target);
        return;
      }
    }
  }
  async applyDamage(character: Character, damage: number, target: Player | NPC) {
    if (!character) return;
    const defValue = character.equipment.armour.defValue;
    character.stats.main.hp = Math.max(character.stats.main.hp - (Math.max(damage - defValue, 0)), 0);
    if (character.stats.main.hp === 0) {
      await this.rollForWound(character, target);
    }
  }
  async dodgeAttack(character: Character, damage: number, target: Player | NPC): Promise<boolean> {
    character.stats.main.sp = Math.max(character.stats.main.sp - 1, 0);
    const dmgToDefender = Math.max(damage - character.equipment.armour.defValue!, 0);
    await this.rollCheck(character.stats.physical.dex)
    if (this.lastRoll >= 12) {
      this.openSnackBar('Sikeres kitérés!');
      return true;
    }
    this.openSnackBar(`Sikertelen kitérés! ${target.name} ${dmgToDefender > 0 ? `sebzést szenved el: -${dmgToDefender} HP` : 'nem szenved el sebzést.'}`);
    await this.applyDamage(character, damage, target);
    return false;
  }
  async attackBack(target: Player | NPC, attacker: Player | NPC, damage: number): Promise<number> {
    if (!this.selectedWeapon) {
      localStorage.setItem('rollCheck', this.lastRoll.toString())
      throw new Error('Nincs kiválasztva fegyver a visszatámadáshoz. Válassz fegyvert és próbáld újra.');
    }
    target!.character!.stats.main.sp = Math.max(target!.character!.stats.main.sp - 1, 0);
    this.openSnackBar(`Visszatámadás. ${target?.name} sebzést szenved el: -${Math.max(damage - target?.character?.equipment.armour.defValue!, 0)} HP`);
    await this.applyDamage(target!.character!, damage, target);
    this.selectedTarget = attacker;
    await this.rollForAttack(this.selectedWeapon.diceCount, this.selectedWeapon.damage);
    const dmgToAttacker = Math.max(this.lastRoll - attacker.character!.equipment.armour.defValue!, 0);
    this.openSnackBar(`Visszatámadás. ${attacker?.name} ${dmgToAttacker > 0 ? `sebzést szenved el: -${dmgToAttacker} HP` : 'nem szenved el sebzést.'}`);
    await this.applyDamage(attacker!.character!, dmgToAttacker, attacker);
    return dmgToAttacker;
  }
  async parryAttack(target: Player | NPC, attacker: Player | NPC, damage: number): Promise<{ success: boolean, dmg: number } | null> {
    if (!this.selectedWeapon) {
      localStorage.setItem('rollCheck', this.lastRoll.toString())
      throw new Error('Nincs kiválasztva fegyver a visszatámadáshoz. Válassz fegyvert és próbáld újra.');
    }
    if (this.selectedWeapon.weaponType === 'ranged') {
      throw new Error('Távolsági fegyverrel nem lehet hárítani. Válassz másik fegyvert.');
    }
    target!.character!.stats.main.sp = Math.max(target!.character!.stats.main.sp - 1, 0);
    await this.rollForAttack(this.selectedWeapon.diceCount, this.selectedWeapon.damage);
    const dmgToAttacker = this.lastRoll;
    if (dmgToAttacker === damage) {
      this.openSnackBar('A két dobás azonos. Nem történik sebzés.');
      return null;
    }
    this.selectedTarget = attacker;
    const newDMG = dmgToAttacker > damage ?
      dmgToAttacker + (dmgToAttacker - damage - attacker.character!.equipment.armour.defValue!) :
      damage + (damage - dmgToAttacker - target.character!.equipment.armour.defValue!);
    if (dmgToAttacker > damage) {
      this.openSnackBar(`Hárítás. ${attacker?.name} sebzést szenved el: -
              ${Math.max(damage - attacker?.character?.equipment.armour.defValue!, 0)} HP`);
      await this.applyDamage(attacker!.character!, newDMG, attacker);
      return { success: true, dmg: newDMG };
    }
    else if (dmgToAttacker < damage) {
      this.openSnackBar(`Sikertelen hárítás. ${target?.name} sebzést szenved el: -
              ${Math.max(damage - target?.character?.equipment.armour.defValue!, 0)} HP`);
      await this.applyDamage(target!.character!, newDMG, target);
      return { success: false, dmg: newDMG };
    }
    return null;
  }
  async npcRollForReaction() {
    try {
      let isPrimary = this.attackIsPrimary();
      this.reactionPanelVisible = false;
      const targetId = isPrimary ? this.game?.currentAction.primary.target! : this.game?.currentAction.secondary!.target!
      const target = this.game?.players.find(p => p.id === targetId) ??
        this.game?.camp.raid.find(r => r.id === targetId) ??
        this.currentEvent?.NPCs.find(n => n.id === targetId);
      if (target?.character?.stats.main.sp! > 1) {
        if (localStorage.getItem('rollCheck')) {
          this.lastRoll = parseInt(localStorage.getItem('rollCheck')!);
          localStorage.removeItem('rollCheck');
        } else {
          await this.openDiceRoller(['d6']);
        }
      }
      const damage = isPrimary ? this.game?.currentAction.primary.value! : this.game?.currentAction.secondary!.value!
      const attacker = this.game?.players.find(p => p.id === this.game?.currentAction.performer.id) ?? null;
      if (target?.character?.stats.main.sp === 1) {
        this.openSnackBar(`A karakter a megőrölés szélén áll, ezért nem reagál. ${target?.name} sebzést szenved el: -
            ${Math.max(damage - target?.character?.equipment.armour.defValue!, 0)} HP`);
        await this.applyDamage(target!.character!, damage, target);
        if (isPrimary) {
          this.game!.currentAction.primary.reaction!.reacted = true;
          attacker!.lastAction.primary!.reaction!.reacted = true;
        } else {
          this.game!.currentAction.secondary!.reaction!.reacted = true;
          attacker!.lastAction.secondary!.reaction!.reacted = true;
        }
        await this.gameService.updateGame(this.gameId, {
          players: this.game?.players,
          camp: this.game?.camp,
          currentAction: this.game?.currentAction,
          currentPlayer: this.game?.prevPlayer,
          prevPlayer: '',
          adventure: this.game?.adventure,
        })
        return;
      } else {
        switch (this.lastRoll) {
          case 1:
          case 2:
            await this.reactToAttack('noReaction');
            break;
          case 3:
          case 4:
            await this.reactToAttack('dodge');
            break;
          case 5:
            await this.reactToAttack('attackBack');
            break;
          case 6:
            await this.reactToAttack('parry');
            break;
          default:
            this.openSnackBar('Ismeretlen eredmény');
            break;
        }
      }
    } catch (error: any) {
      console.error('Hiba az NPC reakciója közben: ', error);
      this.reactionPanelVisible = true;
      if (error.cause !== GameErrorCauses.GameUpdateError) this.openSnackBar(error.message);
      return;
    }

  }
  async attack(isPrimary: boolean) {
    try {
      if (!this.selectedTarget) {
        throw new Error('Válassz ki egy célpontot.');
      }
      if (!localStorage.getItem('selectedCombatTarget')) {
        localStorage.setItem('selectedCombatTarget', this.selectedTarget.id!);
      }
      const target = this.game?.players.find(p => p.id === this.selectedTarget!.id) ??
        this.game?.camp.raid.find(r => r.id === this.selectedTarget!.id) ??
        this.currentEvent?.NPCs.find(n => n.id === this.selectedTarget!.id);
      if (this.isDead(target?.character!)) {
        throw new Error('A célpont halott. Nem támadhatod meg.');
      }
      if (!this.selectedWeapon) {
        throw new Error('Vállassz fegyvert.')
      }
      if ((!this.game?.camp.isCamping || this.isRaid()) && isPrimary && !this.player?.actionsLeft.primary) {
        throw new Error('Nincs elsődleges akciód!');
      } else if ((!this.game?.camp.isCamping || this.isRaid()) && !isPrimary && !this.player?.actionsLeft.secondary) {
        throw new Error('Nincs másodlagos akciód!');
      }
      await this.rollForAttack(this.selectedWeapon.diceCount, this.selectedWeapon.damage);
      this.manageActions(isPrimary, ActionType.ATTACK)
      if (!this.game?.playerOrder.find(p => p.id === target!.id)) {
        this.game?.playerOrder.push({
          id: target!.id,
          initiative: Math.ceil(Math.random() * 20),
          finished: false
        })
      }
      this.player!.inCombat = true;
      target!.inCombat = true;
      this.game!.prevPlayer = this.game?.currentPlayer!;
      this.game!.currentPlayer = this.selectedTarget.id;
      this.game?.playerOrder.sort((a, b) => b.initiative - a.initiative)
      await this.gameService.updateGame(this.gameId, {
        players: this.game?.players,
        currentAction: this.game?.currentAction,
        prevPlayer: this.game?.prevPlayer,
        currentPlayer: this.game?.currentPlayer,
        playerOrder: this.game?.playerOrder,
        adventure: this.game?.adventure,
        camp: this.game?.camp,
      })
    } catch (error) {
      throw error;
    }
  }
  async reactToAttack(type: 'noReaction' | 'dodge' | 'attackBack' | 'parry') {
    try {
      if (this.player?.character?.stats.main.sp === 1 && type !== 'noReaction') {
        if (!confirm('A karaktered a megőrülés szélén áll. Biztosan folytatod?')) {
          return;
        }
        await this.manageDeathAndInsane('insane', this.player);
        await this.gameService.updateGame(this.gameId, {
          players: this.game?.players,
          camp: this.game?.camp,
          adventure: this.game?.adventure,
        });
        this.openSnackBar('A karaktered megőrült.');
        return;
      }
      if (localStorage.getItem('rollCheck')) {
        this.lastRoll = parseInt(localStorage.getItem('rollCheck')!);
        localStorage.removeItem('rollCheck');
      }
      this.reactionPanelVisible = false;
      const attackerId = this.game?.currentAction.performer.id
      const attacker = this.game?.players.find(p => p.id === attackerId) ?? this.game?.camp?.raid.find(r => r.id === attackerId) ?? this.currentEvent?.NPCs.find(n => n.id === attackerId) ?? null;
      this.selectedTarget = attacker ?? null;
      if (!attacker) {
        throw new Error('Nem található a támadó.');
      }
      let reactSuccess: { success: boolean, dmg: number } | boolean | null = null;
      let reactionType: Reaction = Reaction.NO_REACTION;
      let counterDmg = 0;
      const damage = this.attackActionIsPrimary ? this.game?.currentAction.primary.value! : this.game?.currentAction.secondary!.value!;
      const dmgToDefender = Math.max(damage - this.player?.character?.equipment.armour.defValue!, 0);
      switch (type) {
        case 'noReaction':
          this.openSnackBar(`Nincs reakció. ${dmgToDefender > 0 ? `Elszenvedsz -${dmgToDefender} HP sebzést.` : 'Nem szenvedsz sérülést.'}`);
          await this.applyDamage(this.player!.character!, damage, this.player!);
          break;
        case 'dodge':
          reactSuccess = await this.dodgeAttack(this.player!.character!, damage, this.player!);
          reactionType = Reaction.DODGE;
          break;
        case 'attackBack':
          counterDmg = await this.attackBack(this.player!, attacker, damage);
          reactionType = Reaction.ATTACK_BACK;
          break;
        case 'parry':
          reactSuccess = await this.parryAttack(this.player!, attacker, damage);
          reactionType = Reaction.PARRY;
          break;
      }
      const isComplexResult = reactSuccess !== null && typeof reactSuccess === 'object';
      if (this.attackActionIsPrimary) {
        const primaryReaction = {
          reacted: true,
          reactionType: reactionType,
          success: isComplexResult ? (reactSuccess as any).success : (reactSuccess ?? false),
          counterDamage: isComplexResult ? (reactSuccess as any).dmg : counterDmg,
        }
        this.game!.currentAction.primary.reaction = { ...primaryReaction };
        attacker!.lastAction.primary!.reaction = { ...primaryReaction };
      } else {
        const secondaryReaction = {
          reacted: true,
          reactionType: reactionType,
          success: isComplexResult ? (reactSuccess as any).success : (reactSuccess ?? false),
          counterDamage: isComplexResult ? (reactSuccess as any).dmg : counterDmg,
        }
        this.game!.currentAction.secondary!.reaction = { ...secondaryReaction };
        attacker!.lastAction.secondary!.reaction = { ...secondaryReaction };
      }
      await this.gameService.updateGame(this.gameId, {
        players: this.game?.players,
        camp: this.game?.camp,
        currentAction: this.game?.currentAction,
        playerOrder: this.game?.playerOrder,
        currentPlayer: this.game?.prevPlayer ?? '',
        prevPlayer: '',
        adventure: this.game?.adventure,
      })
    } catch (error: any) {
      this.reactionPanelVisible = true;
      console.error('Hiba a reakció végrehatjásakor', error);
      if (error.cause !== GameErrorCauses.GameUpdateError) this.openSnackBar(error.message);
      return;
    }
  }
  async performStatusEffects() {
    try {
      if (!this.player) {
        throw new Error('Nincs játékos adat!');
      }
      const character = this.player.character;
      if (!character) {
        throw new Error('Nincs karakter adat!');
      }
      for (const status of character.activeStatuses) {
        if ([StatusType.BLEED, StatusType.BURN, StatusType.POISON].includes(status.type)) {
          this.openSnackBar(`${this.player?.name} vérzik és sebzést szenved el: -${status.value} HP`);
          character.stats.main.hp = Math.max(character.stats.main.hp - status.value!, 0);
          if (character.stats.main.hp === 0) {
            await this.rollForWound(character, this.player!);
          }
        }
        status.duration -= 1;
        if (status.duration <= 0) {
          character.activeStatuses = character.activeStatuses.filter(s => s !== status);
        }
      }
    } catch (error) {
      console.error('Hiba a státusz hatások végrehajtásakor: ', error);
      this.openSnackBar('Hiba a státusz hatások végrehajtásakor');
      return;
    }
  }

  async toggleNPCVisibility(id: string) {
    try {
      if (this.role !== PlayerRole.HOST) {
        throw new Error('Nincs jogosultságod ehhez a művelethez!', { cause: GameErrorCauses.NoPermission });
      }
      if (this.game?.players.some(p => p.inCombat)) {
        throw new Error('Nem módosítható az NPC-k láthatósága harc közben!', { cause: GameErrorCauses.NPCInCombat });
      }
      const npc = this.currentEvent?.NPCs.find(n => n.id === id) ?? this.game?.camp.raid.find(r => r.id === id);
      if (!npc) throw new Error('NPC nem található!', { cause: GameErrorCauses.NPCNotFound });
      npc.isVisible = !npc.isVisible;
      await this.gameService.updateGame(this.gameId, {
        adventure: this.game?.adventure,
        camp: this.game?.camp,
      });
    } catch (error: any) {
      console.error('Hiba az NPC láthatóság váltásakor: ', error);
      if (error.cause !== GameErrorCauses.GameUpdateError) this.openSnackBar(error.message);
      return;
    }
  }

  /**
   * Check if the player has enough action points to perform the camp action
   * @param apLeft Points the player has left
   * @param apReq Required points to perform the action
   * @returns true if the action is doable, false otherwise
   */
  checkCampActionDoable(apLeft: number, apReq: number): boolean {
    return apLeft - apReq >= 0;
  }


  calculateCampActions() {
    if (this.game) {
      const pC = this.game.players.length;
      const ca = Math.ceil(21 / pC) + 4;
      this.game?.players.forEach(p => {
        const end = p.character?.stats?.physical.end ?? 0;
        p.campActionPoints = ca + end
      })
    }
  }
  async performMandatoryCampAction(type: MandatoryCampActions, customValue: number = 0) {
    try {
      if ('campActionPoints' in this.player! && this.player.campActionPoints > 0) {
        let cost = 0;
        let action = '';
        switch (type) {
          case MandatoryCampActions.START_FIRES:
            cost = this.campActionCosts.fire;
            action = 'fire';
            break;
          case MandatoryCampActions.SET_UP_TENTS:
            cost = this.campActionCosts.tents;
            action = 'tents';
            break;
          case MandatoryCampActions.SET_UP_TRAPS:
            cost = this.campActionCosts.traps;
            action = 'traps';
            break;
          case MandatoryCampActions.GUARD:
            cost = this.campActionCosts.guard;
            action = 'guard';
            break;
        }
        const updatedCampActions = this.game?.camp.campActions;
        if (updatedCampActions && action in updatedCampActions && action in this.campActionCosts) {
          if (this.campActionCosts[action as keyof typeof this.campActionCosts]
            > updatedCampActions![action as keyof typeof updatedCampActions]) {
            let increase = 0;
            if (customValue) {
              increase = Math.min(this.player.campActionPoints,
                cost - updatedCampActions![action as keyof typeof updatedCampActions], customValue)
            } else {
              increase = Math.min(this.player.campActionPoints, cost - updatedCampActions![action as keyof typeof updatedCampActions]);
            }
            this.player.campActionPoints -= increase;
            updatedCampActions![action as keyof typeof updatedCampActions] += increase;
          }
          else {
            throw new Error('Ezt az akciót már teljesítették a táborban!');
          }
        }
        await this.gameService.updateGame(this.gameId, {
          players: this.game?.players,
          camp: this.game?.camp,
        });

      } else {
        throw new Error('Nincs elég tábori akciópontod ehhez az akcióhoz!');
      }
    } catch (error: any) {
      console.error('Hiba az akció végrehajtásakor: ', error);
      throw error;
    }
  }
  async performStandardCampAction(type: StandardCampActions, subType: string) {
    if (!subType) {
      throw new Error('Válassz egy alkategóriát az akcióhoz!');
    }
    if (['jokes', 'story', 'sing', 'music'].includes(subType) && this.game?.players.every(p => p.character?.stats.main.sp === p.character?.stats.main.maxSP)) {
      throw new Error('Minden társad maximum SP-vel rendelkezik. Nem lehetséges a megnyugtatás.')
    }
    if (subType === 'drugs' && this.player?.character?.stats.main.sp === this.player?.character?.stats.main.maxSP) {
      throw new Error('Maximum SP-vel rendelkezel. Nem lehetséges az SP gyógyítás.')
    }
    if (subType === 'herbs' && !this.player?.character?.wounds.small) {
      throw new Error('Nincsenek kis sebeid. Nem lehetséges a gyógyítás.')
    }
    const action = this.campActionSubTypeMap[type].find(a => a.value === subType)
    let rollMod = 0;
    if (action?.check! in this.player?.character?.stats?.physical!) {
      rollMod = this.player?.character?.stats.physical[action?.check as keyof Character['stats']['physical']]!;
    } else if (action?.check! in this.player?.character?.stats?.mental!) {
      rollMod = this.player?.character?.stats.mental[action?.check as keyof Character['stats']['mental']]!;
    }
    if ('campActionPoints' in this.player! && this.player.campActionPoints > 0) {
      if (this.player?.campActionPoints - this.getCampActionCost(type) >= 0) {
        this.player.campActionPoints -= this.getCampActionCost(type);
      } else {
        throw new Error('Nincs elég tábori akciópontod ehhez az akcióhoz!');
      }
    }
    const healSP = (amount: number, target: 'self' | 'party' = 'party') => {
      if (target === 'party') {
        this.game?.players?.forEach(
          p => p.character!.stats.main.sp =
            Math.min(p.character!.stats.main.sp + amount, p.character!.stats.main.maxSP)
        );
      } else
        this.player!.character!.stats.main.sp =
          Math.min(this.player!.character!.stats.main.sp + amount, this.player!.character!.stats.main.maxSP)
    }
    const increaseFood = (amount: number, subType: 'hunt' | 'spices') => {
      if (this.player?.character?.items?.food && this.player.character.items.food.length > 0) {
        let item = this.player.character.items.food.find(f => f.id === 0 || f.id === (type === StandardCampActions.GATHER_PLANTS ? 5 : 6));
        if (item) {
          item.uses! += amount;
        } else {
          const item: Food = {
            id: 5,
            name: 'Élelem',
            desc: `${subType === 'hunt' ? 'Vadászatból szerzett húsok.' : 'Gyűjtögetésből szerzett ehető fűszerek.'}`,
            type: ItemType.FOOD,
            category: ItemCategory.CONSUMABLE,
            size: ItemSize.NORMAL,
            heal: 1,
            uses: amount,
            effects: [
              { type: EffectType.HEAL_HP, value: 1, target: 'self' }
            ]
          }
          this.player!.character!.items!.food!.push(item)
        }
      } else {
        const item: Food = {
          id: 5,
          name: 'Élelem',
          desc: `${subType === 'hunt' ? 'Vadászatból szerzett húsok.' : 'Gyűjtögetésből szerzett ehető fűszerek.'}`,
          type: ItemType.FOOD,
          category: ItemCategory.CONSUMABLE,
          size: ItemSize.NORMAL,
          heal: 1,
          uses: amount,
          effects: [
            { type: EffectType.HEAL_HP, value: 1, target: 'self' }
          ]
        }
        this.player!.character!.items!.food!.push(item)
      }
    }
    await this.rollCheck(rollMod);
    switch (action?.value) {
      case 'jokes':
        if (this.lastRoll) {
          if (this.lastRoll < action.roll) {
            this.openSnackBar('A vicceid túl morbidok voltak, nem sikerült megnyugtatnod a társakat.');
            return;
          }
          healSP(action.bonus)
          this.openSnackBar(`Sikeresen végrehajtottad: ${action.viewValue}`)
        }
        break;
      case 'story':
        if (this.lastRoll) {
          if (this.lastRoll < action.roll) {
            this.openSnackBar('A történeted unalmas volt, nem sikerült megnyugtatnod a társakat.');
            return;
          }
          healSP(action.bonus)
          this.openSnackBar(`Sikeresen végrehajtottad: ${action.viewValue}`)
        }
        break;
      case 'sing':
        if (this.lastRoll) {
          if (this.lastRoll < action.roll) {
            this.openSnackBar('Inkább táncolj, a port jobban bírják, nem sikerült megnyugtatnod a társakat.');
            return;
          }
          healSP(action.bonus)
          this.openSnackBar(`Sikeresen végrehajtottad: ${action.viewValue}`)
        }
        break;
      case 'music':
        if (this.lastRoll) {
          if (this.lastRoll < action.roll) {
            this.openSnackBar('Inkább táncolj, a port jobban bírják, nem sikerült megnyugtatnod a társakat.');
            return;
          }
          healSP(action.bonus)
          this.openSnackBar(`Sikeresen végrehajtottad: ${action.viewValue}`)
        }
        break;
      case 'spices':
        if (this.lastRoll) {
          if (this.lastRoll < action.roll) {
            this.openSnackBar('Hiába kerested egy pocsoja közepén, nem találtál fűszert.');
            return;
          }
          increaseFood(action.bonus, 'spices')
          this.openSnackBar(`Sikeresen végrehajtottad: ${action.viewValue}`)
        }
        break;
      case 'drugs':
        if (this.lastRoll) {
          if (this.lastRoll < action.roll) {
            this.openSnackBar('Futó homokban nem csak te, de más sem talál semmit. Nem találtál füveket.');
            return;
          }
          healSP(action.bonus, 'self')
          this.openSnackBar(`Sikeresen végrehajtottad: ${action.viewValue}`)
        }
        break;
      case 'herbs':
        if (this.lastRoll) {
          if (this.lastRoll < action.roll) {
            this.openSnackBar('Összekeverted a gyógynövényeket az egyszerű hajtásokkal, nem sikerült gyűjtögetned.');
            return;
          }
          if (this.player?.character?.wounds.small)
            this.player.character.wounds.small = Math.max(0, this.player?.character?.wounds.small - action.bonus)
          this.openSnackBar(`Sikeresen végrehajtottad: ${action.viewValue}`)
        }
        break;
      case 'small':
        if (this.lastRoll) {
          if (this.lastRoll < action.roll) {
            this.openSnackBar('Túl lassú voltál, elfutott előled a zsákmány, nem sikerült vadásznod.');
            return;
          }
          increaseFood(action.bonus, 'hunt')
          this.openSnackBar(`Sikeresen végrehajtottad a vadászatot: ${action.viewValue}`)
        }
        break;
      case 'medium':
        if (this.lastRoll) {
          if (this.lastRoll < action.roll) {
            this.openSnackBar('Ráléptél ágy faágra, elijesztetted a vadat, nem sikerült vadásznod.');
            return;
          }
          increaseFood(action.bonus, 'hunt')
          this.openSnackBar(`Sikeresen végrehajtottad a vadászatot: ${action.viewValue}`)
        }
        break;
      case 'large':
        if (this.lastRoll) {
          if (this.lastRoll < action.roll) {
            this.openSnackBar('Ma a vadászból lett a préda, megijedtél a "zsákmánytól", nem sikerült vadásznod.');
            return;
          }
          increaseFood(action.bonus, 'hunt')
          this.openSnackBar(`Sikeresen végrehajtottad a vadászatot: ${action.viewValue}`)
        }
        break;
      default:
        throw new Error('Nem létező akció!');
    }
    await this.gameService.updateGame(this.gameId, { players: this.game?.players })
  }

  async finishTurn() {
    try {
      if (this.role === PlayerRole.PLAYER || (this.role === PlayerRole.HOST && this.player)) {
        this.checkedReaction.primary = false;
        this.checkedReaction.secondary = false;
        localStorage.setItem('checkedReaction' + this.player?.id, JSON.stringify(this.checkedReaction));
        if (!this.game?.camp.isCamping || this.isRaid()) {
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
        } else {
          if ('campActionPoints' in this.player! && this.player.campActionPoints > 0) {
            const text = `Még van ${this.player.campActionPoints} tábori akciópontod. Biztosan befejezed a körödet?`;
            if (!confirm(text)) {
              return;
            }
          }
        }
        await this.performStatusEffects();
        const current = this.game?.playerOrder.find(
          (i) => i.id === this.game?.currentPlayer,
        );
        if (current) {
          let noEnemies = true;
          if (this.game?.playerOrder.some(p => p.id.includes('-'))) {
            noEnemies = false;
          }
          current.finished = true;
          this.game?.playerOrder.sort((a, b) => b.initiative - a.initiative);
          const next = this.game?.playerOrder.find(
            (i) =>
              i.id !== this.game?.currentPlayer &&
              !i.finished,
          );
          if (next) {
            for (const p of this.game?.players!) {
              if (noEnemies) p.inCombat = false;
            }
            await this.gameService.updateGame(this.gameId, {
              currentPlayer: next.id,
              players: this.game?.players,
              adventure: this.game?.adventure,
              playerOrder: this.game?.playerOrder,
              currentAction: {
                performer: { id: '', name: '' },
                primary: {} as GameAction,
                secondary: {} as GameAction,
              }
            });
          } else {
            if (this.game?.camp.isCamping && !this.isRaid()) {
              for (const p of this.game?.players!) {
                p.campActionPoints = 0;
              }
              await this.gameService.updateGame(this.gameId, {
                players: this.game?.players,
                playerOrder: this.game?.playerOrder,
                currentAction: {
                  performer: { id: '', name: '' },
                  primary: {} as GameAction,
                  secondary: {} as GameAction,
                }
              });
            } else {
              await this.startNewTurn();
            }
          }
        }
      }
    } catch (error) {
      console.error('Nem sikerült befejezni a kört: ', error);
      this.openSnackBar('Nem sikerült befejezni a kört!')
      return;
    }
  }

  async startNewTurn() {
    try {
      this.game?.playerOrder.forEach((i) => {
        i.finished = false;
      });
      let noEnemies = true;
      if (this.game?.playerOrder.some(p => p.id.includes('-'))) {
        noEnemies = false;
      }
      this.game?.players.forEach(
        (p) => {
          const limbsLost = p.character?.activeStatuses.filter(s => s.type === StatusType.LOST_LIMB).length ?? 0;
          if (limbsLost === 0) p.actionsLeft = { primary: true, secondary: true };
          else if (limbsLost === 1) p.actionsLeft = { primary: true, secondary: false };
          else p.actionsLeft = { primary: false, secondary: false };
          p.lastAction = {
            performer: { id: '', name: '' },
            primary: {} as GameAction,
            secondary: {} as GameAction,
          }
          if (noEnemies) p.inCombat = false;
        },
      );
      if (this.isRaid()) {
        this.game?.camp.raid.forEach(r => {
          const limbsLost = r.character?.activeStatuses.filter(s => s.type === StatusType.LOST_LIMB).length ?? 0;
          if (limbsLost === 0) r.actionsLeft = { primary: true, secondary: true };
          else if (limbsLost === 1) r.actionsLeft = { primary: true, secondary: false };
          else r.actionsLeft = { primary: false, secondary: false };
          r.lastAction = {
            performer: { id: '', name: '' },
            primary: {} as GameAction,
            secondary: {} as GameAction,
          }
        })
      } else {
        this.currentEvent?.NPCs.forEach(
          (n) => {
            const limbsLost = n.character?.activeStatuses.filter(s => s.type === StatusType.LOST_LIMB).length ?? 0;
            if (limbsLost === 0) n.actionsLeft = { primary: true, secondary: true };
            else if (limbsLost === 1) n.actionsLeft = { primary: true, secondary: false };
            else n.actionsLeft = { primary: false, secondary: false };
            n.lastAction = {
              performer: { id: '', name: '' },
              primary: {} as GameAction,
              secondary: {} as GameAction,
            }
          },
        );
      }
      let newCurrentPlayer = this.game?.playerOrder.sort(
        (a, b) => b!.initiative - a!.initiative,
      )[0].id;
      await this.gameService.updateGame(this.gameId, {
        currentPlayer: newCurrentPlayer,
        currentAction: {
          performer: { id: '', name: '' },
          primary: {} as GameAction,
          secondary: {} as GameAction,
        },
        adventure: this.game?.adventure,
        playerOrder: this.game?.playerOrder,
        players: this.game?.players,
        camp: this.game?.camp,
        vote: this.game?.vote,
      });
    } catch (error) {
      throw error;
    }
  }

  async leaveGame() {
    try {
      this.isLoading = true;
      this.dontWarnLeaving = true;
      await this.gameService.leaveGame(this.gameId, this.role);
      localStorage.removeItem('selectedCombatTarget');
      localStorage.removeItem('selectedWeapon' + this.player?.id);
      localStorage.removeItem('checkedReaction' + this.player?.id);
      this.router.navigateByUrl('/jatek');
    } catch (error) {
      this.isLoading = false;
      console.error('Hiba a játék elhagyásakor: ', error);
    }
  }
  
  preventDecimals(event: KeyboardEvent) {
    if (['.', ',', 'e', 'E'].includes(event.key)) {
      event.preventDefault();
    }
  }
}