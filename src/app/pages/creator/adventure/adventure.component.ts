import { Component, HostListener, ViewChild } from '@angular/core';
import { convertSpeciesNameToKey, createCharacter, getEffectDetails, getStat, getStatDetails, getStatusDetails, setBackground } from '../../../shared/functional/functions';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {
  Adventure,
  AdventureEvent,
  Character,
  GameAction,
  NPC,
} from '../../../shared/models/models';
import { MatSelect, MatOption, MatOptgroup } from '@angular/material/select';
import { CharacterService } from '../../../shared/services/character/character.service';
import { firstValueFrom, Observable, Subscription, take } from 'rxjs';
import { MapContainerComponent } from '../../../shared/functional/map-container/map-container.component';
import {
  cityLocations,
  forestLocations,
  hillLocations,
  Location,
  mountainLocations,
  townLocations,
  waterLocations,
} from '../../../shared/models/map_locations';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardSubtitle,
  MatCardContent,
  MatCardFooter,
} from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { AdventureService } from '../../../shared/services/adventure/adventure.service';
import { Router } from '@angular/router';
import { CanComponentDeactivate } from '../karakter/karakter.component';
import { noWhitespaceValidator } from '../../forum/post-template/post-template.component';
import { Weapon, Armour, Food, SpecialItem, Item, Inventory, Cigar, ItemType, EffectType, StatusType, ItemEffect } from '../../../shared/models/game_interfaces';
import { NationData } from '../../../shared/models/NationData';
import { CharacterVirtues, CharacterDisadvantages } from '../../../shared/models/virtues_disadvantages';
import { ItemService } from '../../../shared/services/item/item.service';
import { MatTooltip } from "@angular/material/tooltip";
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { species } from '../../world/species/species_desc_data';

@Component({
  selector: 'app-adventure',
  imports: [
    MatIconModule,
    MatCheckboxModule,
    MatRadioModule,
    NgClass,
    MatFormFieldModule,
    MatLabel,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelect,
    MatOptgroup,
    MatOption,
    MapContainerComponent,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatCardFooter,
    MatButton,
    MatTooltip,
  ],
  templateUrl: './adventure.component.html',
  styleUrl: './adventure.component.scss',
})
export class AdventureComponent implements CanComponentDeactivate {
  @ViewChild(MapContainerComponent) map!: MapContainerComponent;
  isLoading: boolean = false;
  snackBar = new MatSnackBar()

  private userId = '';

  skipLeaveConfirm: boolean = false;

  eventsPanelVisible: boolean = false;
  npcPanelVisible: boolean = false;
  newCharacterVisible = false;
  showUseManual: boolean = false;

  modify: boolean = false;
  attitude: string = 'neutral';

  adventureName = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  modifyingIndex: number | null = null;

  selectedEventIndex: number = -1;

  action: string = 'Hozzáad';
  actionIcon: string = 'add';

  locations: Location[] = [];

  selectedAdventureEvent?: AdventureEvent;
  events: AdventureEvent[] = [];

  advError: string = '';
  eventForm!: FormGroup;
  eventError: string = '';
  npcForm!: FormGroup;
  npcCharacterForm!: FormGroup;
  npcError: string = '';
  traderForm!: FormGroup;
  traderPanelVisible = false;
  newItemForm!: FormGroup;
  newItemError = '';
  newItemPanelVisible = false;
  newItemEffectForm!: FormGroup;
  newItemEffectPanelVisible = false;
  trades: Record<string, { item: Food | SpecialItem | Cigar, pieces: number }[]> = {
    foods: [] as { item: Food, pieces: number }[],
    medicalItems: [] as { item: SpecialItem, pieces: number }[],
    specialDrinks: [] as { item: SpecialItem, pieces: number }[],
    cigars: [] as { item: Cigar, pieces: number }[],
  }
  ItemType = ItemType;

  newNPCCharacters: Character[] = []
  /* NPC NEW CHARACTER */
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
  medicalItems = [] as SpecialItem[];
  specialDrinks = [] as SpecialItem[];
  cigars = [] as Cigar[]
  specialIndex = 0;
  specialItems = [] as SpecialItem[];
  generalItems = [] as (Item | Inventory)[];

  ItemTypes = [
    { value: ItemType.FOOD, viewValue: 'Étel', icon: 'beer_meal' },
    { value: ItemType.MEDICAL, viewValue: 'Gyógyszer', icon: 'health_cross' },
    { value: ItemType.SPECIAL, viewValue: 'Különleges ital', icon: 'science' },
    { value: ItemType.CIGAR, viewValue: 'Szivar', icon: 'smoking_rooms' },
  ]
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
  Stats = [
    { value: 'str', name: 'Erő', icon: 'fitness_center' },
    { value: 'dex', name: 'Ügyesség', icon: 'sports_martial_arts' },
    { value: 'end', name: 'Kitartás', icon: 'directions_run' },
    { value: 'int', name: 'Ész', icon: 'auto_stories' },
    { value: 'cun', name: 'Fortély', icon: 'psychology' },
    { value: 'wil', name: 'Akaraterő', icon: 'diamond' },
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
    { value: StatusType.DEAD },
    { value: StatusType.INSANE }
  ];

  myCharacters!: Character[];

  myCharSub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private charService: CharacterService,
    private advService: AdventureService,
    private itemService: ItemService,
    private router: Router,
    private authService: AuthService
  ) { }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.skipLeaveConfirm) return true;
    if (this.adventureName.dirty || this.events.length > 0 ||
      this.npcForm.dirty || this.traderForm.dirty || this.newItemForm.dirty)
      return confirm(
        'Nem mentett változásaid vannak! Biztosan elhagyod az oldalt?'
      );
    return true;
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.skipLeaveConfirm) return;
    /* if (this.adventureName.dirty || this.events.length > 0 ||
      this.npcForm.dirty || this.traderForm.dirty || this.newItemForm.dirty) {
      $event.returnValue = true;
    } */
  }

  async ngOnInit() {
    setBackground('paper_bg');
    this.initForms();
    const user = await firstValueFrom(this.authService.currentUser.pipe(take(1)))
    this.userId = user?.uid!;
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
    this.medicalItems = this.itemService.getItemGroup('heal') as SpecialItem[];
    this.specialDrinks = this.itemService.getItemGroup(
      'specDrinks'
    ) as SpecialItem[];
    this.cigars = this.itemService.getItemGroup('cigars') as Cigar[];


    this.myCharSub = this.charService
      .getAllCharacters()
      .pipe(take(1))
      .subscribe((value) => {
        this.myCharacters = value;
      });

    this.locations = cityLocations
      .concat(townLocations)
      .concat(forestLocations)
      .concat(mountainLocations)
      .concat(hillLocations)
      .concat(waterLocations);
  }

  getStatusDetails(statusType: StatusType) {
    return getStatusDetails(statusType);
  }
  getStatDetails(stat: string) {
    return getStatDetails(stat);
  }

  showUIs(which: 'events' | 'npcs' | 'trader' | 'newItem', itemType?: ItemType) {
    switch (which) {
      case 'events':
        this.eventsPanelVisible = true;
        break;
      case 'npcs':
        this.npcPanelVisible = true;
        break;
      case 'trader':
        this.traderPanelVisible = true;
        const hasTradesAlready = this.canSetTrades
        break;
      case 'newItem':
        this.newItemPanelVisible = true;
        this.newItemForm.get('type')?.patchValue(itemType ?? ItemType.COMMON);
        break;
    }
    this.action = 'Hozzáad';
    this.actionIcon = 'add';
  }

  hideUIs(which: 'events' | 'npcs' | 'trader' | 'newItem') {
    switch (which) {
      case 'events':
        this.eventsPanelVisible = false;
        this.resetForm(this.eventForm);
        break;
      case 'npcs':
        this.npcPanelVisible = false;
        this.resetForm(this.npcForm);
        this.clearTraderFormArrays();
        this.trades = {
          foods: [] as { item: Food, pieces: number }[],
          medicalItems: [] as { item: SpecialItem, pieces: number }[],
          specialDrinks: [] as { item: SpecialItem, pieces: number }[],
          cigars: [] as { item: Cigar, pieces: number }[],
        }
        break;
      case 'trader':
        this.traderPanelVisible = false;
        this.traderForm.reset({
          foods: [],
          medicalItems: [],
          specialDrinks: [],
          cigars: [],
        })
        break;
      case 'newItem':
        this.newItemPanelVisible = false;
        break;
    }
    this.modify = false;
    this.modifyingIndex = null;
  }

  toggleEffectForm() {
    this.newItemEffectPanelVisible = !this.newItemEffectPanelVisible
  }

  initForms() {
    this.eventForm = this.fb.group({
      location: [null, [Validators.required]],
      name: [
        '',
        [noWhitespaceValidator, Validators.required, Validators.minLength(3)],
      ],
      desc: ['', [noWhitespaceValidator]],
      story: ['', [noWhitespaceValidator]],
    });
    this.npcForm = this.fb.group({
      name: ['', [noWhitespaceValidator, Validators.required]],
      attitude: ['neutral', [Validators.required]],
      isTrader: [false],
      character: ['', [Validators.required]],
      isVisible: [true],
    });
    this.npcCharacterForm = this.fb.group({
      name: [''],
      species: [''],
      specialProperties: this.fb.group({
        speciesSpecial: [''],
        home: [''],
      }),
      equipment: this.fb.group({
        left: [''],
        right: [''],
        armour: [''],
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
          wil: [0, [Validators.min(-15), Validators.max(15)]]
        }),
        main: this.fb.group({
          hp: [null, [Validators.min(1)]],
          sp: [null, [Validators.min(1)]]
        }),
      }),
      virtues: this.fb.group({
        virtues: [''],
        disadv: [''],
      }),
      items: this.fb.group({
        food: this.fb.array<FormControl<number>>([new FormControl()]),
        specialItems: this.fb.array<FormControl<number>>([
          new FormControl(),
          new FormControl(),
          new FormControl(),
        ]),
        generalItems: this.fb.array<FormControl<number>>([
          new FormControl(),
          new FormControl(),
          new FormControl(),
          new FormControl(),
          new FormControl(),
        ]),
      })
    })
    this.traderForm = this.fb.group({
      foods: this.fb.array<FormGroup>([]),
      medicalItems: this.fb.array<FormGroup>([]),
      specialDrinks: this.fb.array<FormGroup>([]),
      cigars: this.fb.array<FormGroup>([]),
    })
    this.newItemForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), noWhitespaceValidator]],
      desc: ['', [Validators.minLength(3), Validators.maxLength(200), noWhitespaceValidator]],
      type: [ItemType.FOOD, [Validators.required]],
      uses: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
      effects: this.fb.array([]),
      effectDesc: ['', [Validators.minLength(3), Validators.maxLength(200), noWhitespaceValidator]],
      isPartyWide: [false],
      combat: [false],
      color: ['', [Validators.minLength(3), Validators.maxLength(15), noWhitespaceValidator]],
      spice: ['', [Validators.minLength(3), Validators.maxLength(30), noWhitespaceValidator]],
      price: [5, [Validators.required, Validators.min(1), Validators.max(10000)]],
    })
    this.newItemEffectForm = this.fb.group({
      type: [EffectType.HEAL_HP, [Validators.required]],
      duration: [1, [Validators.required, Validators.min(1), Validators.max(1000)]],
      value: [1, [Validators.required, Validators.min(1), Validators.max(50)]],
      stat: ['str', [Validators.required]],
      status: [StatusType.BLEED, [Validators.required]],
      target: ['self', [Validators.required]]
    })
    this.npcForm.get('isTrader')?.valueChanges.subscribe((value) => {
      this.traderPanelVisible = value;
    })
  }

  getTradeArray(group: 'foods' | 'medicalItems' | 'specialDrinks' | 'cigars'): FormArray<FormGroup> {
    return this.traderForm.get(group) as FormArray<FormGroup>;
  }

  getEffectDetails(effectType: EffectType) {
    return getEffectDetails(effectType)
  }

  getInputs(which: string): FormArray<FormControl<number>> {
    return this.npcCharacterForm.get(which) as FormArray<FormControl<number>>;
  }

  openSnackBar(msg: string) {
    this.snackBar.open(msg, '', { duration: 2500 })
  }

  addEvent() {
    if (!this.eventForm.valid) {
      this.eventError = 'Töltsd ki a kötelező mezőket!';
      console.error('Hibás kitöltés', this.eventForm.value);
      return;
    }
    const eventValues = this.eventForm.value;
    if (this.modify && this.modifyingIndex !== null) {
      let modifiedEvent = this.events[this.modifyingIndex];
      modifiedEvent.name = eventValues.name;
      modifiedEvent.location = eventValues.location;
      modifiedEvent.desc = eventValues.desc;
      modifiedEvent.story = eventValues.story;
      this.modify = false;
      this.modifyingIndex = null;
    } else {
      let event: AdventureEvent = {
        id: this.events.length,
        name: eventValues.name,
        location: eventValues.location,
        desc: eventValues.desc,
        story: eventValues.story,
        NPCs: [],
        completed: false,
      };
      this.events.push(event);
    }
    this.hideUIs('events');
    this.resetForm(this.eventForm);
  }

  /**
   * Removes an element from an object.
   * @param id The ID of the element to remove.
   * @param object The object the element should be removed from.
   */
  remove(id: string | number, what: 'event' | 'npc') {
    if (what === 'event') {
      this.events = this.events.filter((e) => e.id !== id);
    } else if (this.selectedAdventureEvent) {
      this.selectedAdventureEvent.NPCs =
        this.selectedAdventureEvent.NPCs.filter((e) => e.id !== id);
    }
  }

  selectLocation(location: string) {
    this.showUIs('events');
    this.eventForm.patchValue({ location: location });
  }

  selectEvent(index: number) {
    if (
      this.selectedAdventureEvent &&
      this.events.indexOf(this.selectedAdventureEvent) !== index
    ) {
      this.selectedAdventureEvent = this.events[index];
    } else {
      this.selectedAdventureEvent = this.events[index];
    }
    this.selectedEventIndex = index;
  }
  loadTradeControls(trades: Record<string, { item: Food | SpecialItem | Cigar, pieces: number }[]>) {
    Object.entries(trades).forEach(([group, items]) => {
      items.forEach(tradeItem => {
        this.addItemToTrades(tradeItem.item, group as 'foods' | 'medicalItems' | 'specialDrinks' | 'cigars');
      })
    })
  }
  clearTraderFormArrays() {
    this.getTradeArray('foods').clear();
    this.getTradeArray('medicalItems').clear();
    this.getTradeArray('specialDrinks').clear();
    this.getTradeArray('cigars').clear();
  }
  edit(index: number, type: 'events' | 'npcs') {
    this.modify = true;
    this.modifyingIndex = index;
    this.showUIs(type);
    this.action = 'Módosít';
    this.actionIcon = 'settings';
    switch (type) {
      case 'events':
        let event = this.events[index];
        this.eventForm.patchValue({
          name: event.name,
          location: event.location,
          desc: event.desc,
          story: event.story,
        });
        break;
      case 'npcs':
        let npc = this.selectedAdventureEvent?.NPCs[index];
        if (npc?.character) {
          const inMyChars = this.myCharacters?.some(c => c.id === npc?.character?.id);
          const inNewChars = this.newNPCCharacters?.some(c => c.id === npc?.character?.id);
          if (!inMyChars && !inNewChars) {
            this.newNPCCharacters.push(npc.character);
          }
        }
        this.npcForm.patchValue({
          name: npc?.name,
          attitude: npc?.attitude,
          isTrader: npc?.isTrader,
          isVisible: npc?.isVisible,
          character: npc?.character?.id!,
        }, { emitEvent: false });
        if (npc?.isTrader && npc?.trades) {
          this.trades = npc.trades;
          this.clearTraderFormArrays()
          this.loadTradeControls(npc?.trades)
        }
    }
  }

  resetForm(resetable: FormGroup) {
    if (resetable === this.npcForm) {
      this.npcError = '';
      resetable.reset({
        name: '',
        desc: '',
        story: '',
        attitude: 'neutral',
        character: '',
        isVisible: true,
      });
      this.attitude = 'neutral';
    } else {
      this.eventError = '';
      resetable.reset();
    }
  }

  toggleNewCharacter() {
    this.newCharacterVisible = !this.newCharacterVisible
  }

  setRelevantSpeciesData(value: any) {
    let currentSpecies = convertSpeciesNameToKey(value);
    this.currentSpeciesProperties =
      species[currentSpecies!.landID][currentSpecies!.speciesID].speciesSpecial;
    this.currentSpeciesHomes =
      species[currentSpecies!.landID][currentSpecies!.speciesID].homes;
  }
  createNPCCharacter() {
    try {
      const id = `${this.selectedAdventureEvent?.name}-${this.newNPCCharacters.length}`
      let newCharacter: Character = createCharacter(this.npcCharacterForm, this.itemService, id, this.userId);
      console.log(newCharacter);
      this.newNPCCharacters.push(newCharacter);
      this.npcForm.patchValue({ character: newCharacter.id }, { emitEvent: false });
      this.newCharacterVisible = false
      this.npcCharacterForm.reset();
    } catch (error: any) {
      this.openSnackBar(error.message)
      return;
    }
  }

  addNPC() {
    if (!this.npcForm.valid) {
      console.error('Hibás kitöltés', this.npcForm.value);
      this.npcError = 'Töltsd ki a kötelező mezőket!';
      return;
    }
    const npcValues = this.npcForm.value;

    if (this.modify && this.modifyingIndex !== null) {
      let modifiedNPC = this.selectedAdventureEvent?.NPCs[this.modifyingIndex];
      let character = this.myCharacters.concat(this.newNPCCharacters).find(c => c.id === npcValues.character)!
      if (modifiedNPC) {
        modifiedNPC.name = npcValues.name;
        modifiedNPC.attitude = npcValues.attitude;
        modifiedNPC.character = character;
        modifiedNPC.isTrader = npcValues.isTrader;
        modifiedNPC.isVisible = npcValues.isVisible;
        modifiedNPC.trades = npcValues.isTrader ? this.trades : null;
        this.modify = false;
        this.modifyingIndex = null;
      }
    } else {
      let character = this.myCharacters.find(
        (char) => char.id === npcValues.character
      )! ?? this.newNPCCharacters.find(
        (char) => char.id === npcValues.character
      )!
      const isTrader = (npcValues.attitude === 'neutral' && npcValues.isTrader) as boolean;
      if (isTrader && !this.canSetTrades()) {
        this.npcError = 'Egy kereskedőnek legalább egy árucikke kell, hogy legyen!';
        return;
      }
      let npc: NPC = {
        id: `${this.selectedAdventureEvent?.id}-${this.selectedAdventureEvent?.NPCs.length}`,
        name: npcValues.name,
        attitude: npcValues.attitude,
        actionsLeft: { primary: true, secondary: true },
        inCombat: false,
        initiative: null,
        isTrader: isTrader,
        trades: isTrader ? this.trades : null,
        isVisible: npcValues.isVisible ?? false,
        lastAction: {
          performer: { id: '', name: '' },
          primary: {} as GameAction,
          secondary: {} as GameAction,
        },
        character: character,
      };
      console.log(npc);
      this.selectedAdventureEvent?.NPCs.push(npc);
    }
    this.hideUIs('npcs');
    this.resetForm(this.npcForm);
    this.traderForm.reset();
    this.clearTraderFormArrays()
    this.trades = {
      foods: [] as { item: Food, pieces: number }[],
      medicalItems: [] as { item: SpecialItem, pieces: number }[],
      specialDrinks: [] as { item: SpecialItem, pieces: number }[],
      cigars: [] as { item: Cigar, pieces: number }[],
    };
  }

  setAttitude(which: string) {
    switch (which) {
      case 'neutral':
        break;
      case 'hostile':
        break;
    }
    this.attitude = which;
  }

  getCharacterName(id: string): string {
    this.myCharacters.forEach((char) => {
      if (char.id === id) {
        return char.name;
      }
      return '';
    });
    return '';
  }

  changeMap() {
    this.map.changeMap(this.map.mapType === 'aradas' ? false : true);
  }

  userManual(show: boolean) {
    this.showUseManual = show;
  }

  createAdventure() {
    if (this.adventureName.valid) {
      if (this.events.length === 0) {
        this.advError = 'Adj legaglább egy eseményt a kalandhoz!';
        return;
      }
      let adventure: Omit<Adventure, 'id' | 'userId'> = {
        name: this.adventureName.value,
        events: this.events,
      };
      this.advService
        .addAdventure(adventure)
        .then(() => {
          this.skipLeaveConfirm = true;
          this.adventureName.reset('');
          this.adventureName.markAsPristine();
          this.events = [];
          this.selectedAdventureEvent = undefined;
          this.npcForm.reset();
          this.eventForm.reset();
          localStorage.setItem('visibleContainerOnProfile', 'events')
        })
        .catch((error) => {
          console.error('Hiba a kaland hozzáadásakor: ', error);
        })
        .finally(() => {
          console.log('Kaland létrehozva: ', adventure);
          this.router.navigateByUrl('/profil');
        });
    } else {
      this.advError = 'Adj nevet a kalandnak!';
      console.error('Hibás kaland!');
    }
  }

  itemIsInTrades(itemId: number, group: 'foods' | 'medicalItems' | 'specialDrinks' | 'cigars'): boolean {
    return this.getTradeArray(group).controls.some(
      ctrl => ctrl.get('id')?.value === itemId
    );
  }
  AllItemsInGroupAreSelected(group: 'foods' | 'medicalItems' | 'specialDrinks' | 'cigars'): boolean {
    const array = this.getTradeArray(group);
    let itemsToCheck: (Item | Food | SpecialItem)[] = [];
    switch (group) {
      case 'foods':
        itemsToCheck = this.foods;
        break;
      case 'medicalItems':
        itemsToCheck = this.medicalItems;
        break;
      case 'specialDrinks':
        itemsToCheck = this.specialDrinks;
        break;
      case 'cigars':
        itemsToCheck = this.cigars;
        break;
    }
    return array.length === itemsToCheck.length && array.length > 0;
  }
  canSetTrades(): boolean {
    return this.getTradeArray('foods').length > 0 ||
      this.getTradeArray('medicalItems').length > 0 ||
      this.getTradeArray('specialDrinks').length > 0 ||
      this.getTradeArray('cigars').length > 0;
  }
  addItemToTrades(item: Item | Food | SpecialItem, group: 'foods' | 'medicalItems' | 'specialDrinks' | 'cigars', all: boolean = false) {
    const array = this.getTradeArray(group);
    const existingIndex = array.controls.findIndex(
      ctrl => ctrl.get('id')?.value === item.id
    );

    if (existingIndex !== -1 && !all) {
      array.removeAt(existingIndex);
    } else {
      if (all && array.controls.find(ctrl => ctrl.get('id')?.value === item.id)) return;
      const itemGroup = this.fb.group({
        id: [item.id],
        name: [item.name],
        pieces: ['', [Validators.min(1), Validators.max(999)]]
      });
      array.push(itemGroup);
    }
  }
  toggleAllInGroup(toggleValue: boolean, group: 'foods' | 'medicalItems' | 'specialDrinks' | 'cigars') {
    const array = this.getTradeArray(group);
    if (toggleValue) {
      let itemsToAdd: (Item | Food | SpecialItem)[] = [];
      switch (group) {
        case 'foods':
          itemsToAdd = this.foods;
          break;
        case 'medicalItems':
          itemsToAdd = this.medicalItems;
          break;
        case 'specialDrinks':
          itemsToAdd = this.specialDrinks;
          break;
        case 'cigars':
          itemsToAdd = this.cigars;
          break;
      }
      itemsToAdd.forEach(item => {
        this.addItemToTrades(item, group, true);
      })
    } else {
      array.clear();
    }
  }
  getItemControl(itemId: number, group: 'foods' | 'medicalItems' | 'specialDrinks' | 'cigars'): FormControl | null {
    const found = this.getTradeArray(group).controls.find(
      ctrl => ctrl.get('id')?.value === itemId
    );
    return found?.get('pieces') as FormControl ?? null;
  }
  setTraderSettings() {
    const value = this.traderForm.value;
    this.trades['foods'] = value.foods.map((item: any) => {
      return { item: { ...this.foods.find(f => f.id === item.id)! }, pieces: item.pieces || 999 }
    })
    this.trades['medicalItems'] = value.medicalItems.map((item: any) => {
      return { item: { ...this.medicalItems.find(f => f.id === item.id)! }, pieces: item.pieces || 999 }
    })
    this.trades['specialDrinks'] = value.specialDrinks.map((item: any) => {
      return { item: { ...this.specialDrinks.find(f => f.id === item.id)! }, pieces: item.pieces || 999 }
    })
    this.trades['cigars'] = value.cigars.map((item: any) => {
      return { item: { ...this.cigars.find(f => f.id === item.id)! }, pieces: item.pieces || 999 }
    })
    console.log(this.trades);
    this.traderPanelVisible = false;
  }
  removeEffectFromItem(index: number) {
    const effectsArray = this.newItemForm.get('effects') as FormArray;
    effectsArray.removeAt(index);
  }
  addEffectToItem() {
    if (this.newItemEffectForm.invalid) {
      this.newItemError = 'Töltsd ki a kötelező mezőket.';
      return;
    }
    const value = this.newItemEffectForm.value;
    const effectsArray = this.newItemForm.get('effects') as FormArray;
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
      this.newItemError = 'Ez a hatás már hozzá lett adva ugyanezzel a céllal.';
      return;
    }
    this.newItemEffectPanelVisible = false;
    this.newItemError = '';
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
  addNewItemToTradableItems() {
    if (this.newItemForm.invalid) {
      this.newItemError = 'Töltsd ki a kötelező mezőket.';
      return;
    }
    const value = this.newItemForm.value;
    if (['SPECIAL', 'CIGAR'].includes(value.type) && value.effectDesc.trim().length === 0) {
      this.newItemError = 'Adj meg egy leírást a különleges hatásoknak! Pl.: +3 HP 10 percig (kör).';
      return;
    }
    if (value.effects.length === 0) {
      this.newItemError = 'Adj hozzá legalább egy hatást az tárgyhoz!';
      return;
    }
    if (value.type === ItemType.CIGAR) {
      if (value.color.trim().length === 0) {
        this.newItemError = 'Add meg a szivar színét!';
        return;
      }
      if (value.spice.trim().length === 0) {
        this.newItemError = 'Add meg a szivar fűszerezését!';
        return;
      }
    }
    const highestId = this.foods.concat(this.medicalItems).concat(this.specialDrinks).concat(this.cigars).sort((a, b) => b.id! - a.id!)[0]?.id ?? 0;
    let newItem: any = {
      id: this.itemService.generateNewItemID(highestId),
      name: value.name ?? '',
      desc: value.desc ?? '',
      type: value.type ?? ItemType.FOOD,
      category: 'CONSUMABLE',
      uses: value.uses ?? 1,
      effects: value.effects ?? [],
      price: value.price ?? 5,
    }

    switch (value.type) {
      case ItemType.MEDICAL:
      case ItemType.SPECIAL:
        newItem.isPartyWide = value.isPartyWide ?? false;
        newItem.combat = value.combat ?? false;
        if (value.type === ItemType.SPECIAL) {
          newItem.effectDesc = value.effectDesc ?? '';
          this.specialDrinks.push(newItem);
        } else {
          this.medicalItems.push(newItem);
        }
        break;
      case ItemType.CIGAR:
        newItem.effectDesc = value.effectDesc ?? '';
        newItem.color = value.color ?? '';
        newItem.spice = value.spice ?? '';
        this.cigars.push(newItem);
        break;
      default:
        const heal = newItem.effects.find((eff: ItemEffect) =>
          [EffectType.HEAL_HP, EffectType.HEAL_SP, EffectType.HEAL_SMALL_WOUND, EffectType.HEAL_LARGE_WOUND].includes(eff.type)
        );
        newItem.heal = heal ? heal.value : 0;
        this.foods.push(newItem);
        break;
    }
    this.newItemPanelVisible = false;
    this.newItemError = '';
    this.newItemForm.reset({
      name: '',
      desc: '',
      type: ItemType.FOOD,
      uses: 1,
      effects: [],
      effectDesc: '',
      isPartyWide: false,
      combat: false,
      color: '',
      spice: '',
      price: 5,
    })
  }
}
