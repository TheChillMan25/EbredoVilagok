import { Component, HostListener } from '@angular/core';
import {
  convertSpeciesNameToKey,
  createRandomCharacter,
  setBackground,
} from '../../../shared/functional/functions';
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
  FormArray,
} from '@angular/forms';
import { MatLabel, MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NationData } from '../../../shared/models/NationData';
import { species } from '../../world/species/species_desc_data';
import { MatIcon } from '@angular/material/icon';
import {
  Armour,
  Food,
  Inventory,
  Item,
  SpecialItem,
  Weapon,
} from '../../../shared/models/game_interfaces';
import {
  CharacterDisadvantages,
  CharacterVirtues,
} from '../../../shared/models/virtues_disadvantages';
import { Character } from '../../../shared/models/models';
import { CharacterService } from '../../../shared/services/character/character.service';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable } from 'rxjs';
import { ItemService } from '../../../shared/services/item/item.service';
import { noWhitespaceValidator } from '../../forum/post-template/post-template.component';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Component({
  selector: 'app-karakter',
  imports: [
    MatTooltipModule,
    MatLabel,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatIcon,
    NgClass,
  ],
  templateUrl: './karakter.component.html',
  styleUrl: './karakter.component.scss',
})
export class KarakterComponent implements CanComponentDeactivate {
  isLoading: boolean = false;

  errorMessage: string = '';
  mainForm!: FormGroup;
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
      interval: { min: -3, max: 3 },
    },
    {
      controlName: 'mental',
      fields: [
        { groupName: 'int', labelText: 'Ész', icon: 'auto_stories' },
        { groupName: 'cun', labelText: 'Fortély', icon: 'psychology' },
        { groupName: 'wil', labelText: 'Akaraterő', icon: 'diamond' },
      ],
      interval: { min: -3, max: 3 },
    },
    {
      controlName: 'main',
      fields: [
        { groupName: 'hp', labelText: 'HP', icon: 'health_metrics' },
        { groupName: 'sp', labelText: 'SP', icon: 'mindfulness' },
      ],
      interval: { min: 1, max: 20 },
    },
  ];

  foods = [] as Food[];
  specialIndex = 0;
  specialItems = [] as SpecialItem[];
  generalItems = [] as (Item | Inventory)[];

  showDiceMenu: boolean = false;

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private charService: CharacterService,
    private router: Router
  ) {}

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.mainForm.dirty) {
      return confirm(
        'Nem mentett változásaid vannak! Biztosan elhagyod az oldalt?'
      );
    }
    return true;
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.mainForm.dirty) {
      $event.returnValue = true;
    }
  }

  async ngOnInit() {
    setBackground('paper_bg');
    this.initForm();
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
  }

  initForm() {
    this.mainForm = this.fb.group({
      name: ['', [noWhitespaceValidator,Validators.required, Validators.minLength(3)]],
      species: ['', Validators.required],
      class: ['', Validators.required],
      specialProperties: this.fb.group({
        speciesProperty: ['', Validators.required],
        home: ['', Validators.required],
      }),
      stats: this.fb.group({
        physical: this.fb.group({
          str: [
            0,
            [Validators.required, Validators.min(-3), Validators.max(3)],
          ],
          dex: [
            0,
            [Validators.required, Validators.min(-3), Validators.max(3)],
          ],
          end: [
            0,
            [Validators.required, Validators.min(-3), Validators.max(3)],
          ],
        }),
        mental: this.fb.group({
          int: [
            0,
            [Validators.required, Validators.min(-3), Validators.max(3)],
          ],
          cun: [
            0,
            [Validators.required, Validators.min(-3), Validators.max(3)],
          ],
          wil: [
            0,
            [Validators.required, Validators.min(-3), Validators.max(3)],
          ],
        }),
        main: this.fb.group({
          hp: ['', [Validators.required, Validators.min(1)]],
          sp: ['', [Validators.required, Validators.min(1)]],
        }),
      }),
      equipment: this.fb.group({
        left: [''],
        right: [''],
        armour: [''],
      }),
      virtues: this.fb.group({
        virtues: this.fb.array<FormControl<number>>([
          new FormControl(),
          new FormControl(),
        ]),
        disadvantage: this.fb.array<FormControl<number>>([new FormControl()]),
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
      }),
    });
  }

  createCharacter() {
    if (!this.mainForm.valid) {
      this.errorMessage =
        'Karakter nem készíthető el, tölts ki minden kötelező mezőt!';
      return;
    }
    this.isLoading = true;
    const formValue = this.mainForm.value;

    let food: Food[] = [];
    formValue.items.food.forEach((c: number | null) => {
      if (c) {
        food.push(this.itemService.getItemById('food', c) as Food);
      }
    });
    let special: SpecialItem[] = [];
    formValue.items.specialItems.forEach((c: number | null) => {
      if (c) {
        special.push(
          this.itemService.getItemById('allSpecial', c) as SpecialItem
        );
      }
    });
    let general: (Item | Inventory)[] = [];
    formValue.items.generalItems.forEach((c: number | null) => {
      if (c) {
        general.push(this.itemService.getItemById('allGeneral', c));
      }
    });

    let newCharacter: Omit<Character, 'id' | 'userId'> = {
      currentAdventure: '',
      name: formValue.name || '',
      species: formValue.species || '',
      class: formValue.class || '',
      level: 1,
      specialProperties: {
        speciesProperty: formValue.specialProperties.speciesProperty ?? 0,
        home: formValue.specialProperties.home ?? 0,
      },
      stats: {
        physical: {
          str: formValue.stats.physical.str ?? 1,
          dex: formValue.stats.physical.dex ?? 1,
          end: formValue.stats.physical.end ?? 1,
        },
        mental: {
          int: formValue.stats.mental.int ?? 1,
          cun: formValue.stats.mental.cun ?? 1,
          wil: formValue.stats.mental.wil ?? 1,
        },
        main: {
          hp: formValue.stats.main.hp ?? 1,
          maxHP: formValue.stats.main.hp ?? 1,
          sp: formValue.stats.main.sp ?? 1,
          maxSP: formValue.stats.main.sp ?? 1,
        },
      },
      equipment: {
        left:
          (this.itemService.getItemById(
            'weapons',
            formValue.equipment.left
          ) as Weapon) ?? '',
        right:
          (this.itemService.getItemById(
            'weapons',
            formValue.equipment.right
          ) as Weapon) ?? '',
        armour:
          (this.itemService.getItemById(
            'armours',
            formValue.equipment.armour
          ) as Armour) ?? '',
      },
      virtues: {
        virtues: formValue.virtues.virtues ?? [],
        disadv: formValue.virtues.disadvantage ?? [],
      },
      items: {
        food: food ?? [],
        specialItems: special ?? [],
        generalItems: general ?? [],
        equipmentItems: [],
      },
      wounds: {
        small: 0,
        large: 0,
      },
      activeStatuses: [],
    };

    this.charService
      .addCharacter(newCharacter)
      .then(() => {
        this.mainForm.reset();
      })
      .catch((error) => {
        this.isLoading = false;
        console.error('Hiba a karakter létrehozása során: ', error);
      })
      .finally(() => {
        console.log('Karakter létrehozva: ', newCharacter);
        this.router.navigateByUrl('/profil');
      });
  }

  createRandomCharacter() {
    const charName = this.mainForm.get('name')?.value;
    if (charName === '' || charName.length < 3) {
      this.errorMessage = 'Töltsd ki a név mezőt!';
      return;
    }
    const random = createRandomCharacter(charName, this.itemService);
    const foodArray = this.mainForm.get('items.food') as FormArray;
    foodArray.clear();
    random.items.food.forEach((item) => {
      if (item?.id) foodArray.push(new FormControl(item.id));
    });
    const specialArray = this.mainForm.get('items.specialItems') as FormArray;
    specialArray.clear();
    random.items.specialItems.forEach((item) => {
      if (item?.id) specialArray.push(new FormControl(item.id));
    });
    const generalArray = this.mainForm.get('items.generalItems') as FormArray;
    generalArray.clear();
    random.items.generalItems.forEach((item) => {
      if (item?.id) generalArray.push(new FormControl(item.id));
    });
    console.log(random);

    this.mainForm.get('species')?.setValue(random.species);
    this.setRelevantSpeciesData(random.species);

    this.mainForm.patchValue({
      class: random.class,
      level: random.level,
      specialProperties: {
        speciesProperty: random.specialProperties.speciesProperty,
      },
      stats: random.stats,
      equipment: {
        left: random.equipment.left.id,
        right: random.equipment.right.id,
        armour: random.equipment.armour.id,
      },
      virtues: {
        virtues: random.virtues.virtues,
        disadvantage: random.virtues.disadv,
      },
    });

    this.mainForm
      .get('specialProperties.home')
      ?.setValue(random.specialProperties.home);
    this.selectHome(random.specialProperties.home);
  }

  selectHome(index: any) {
    this.currentHome = this.currentSpeciesHomes[index];
  }

  setRelevantSpeciesData(value: any) {
    let currentSpecies = convertSpeciesNameToKey(value);
    this.currentSpeciesProperties =
      species[currentSpecies!.landID][currentSpecies!.speciesID].speciesSpecial;
    this.currentSpeciesHomes =
      species[currentSpecies!.landID][currentSpecies!.speciesID].homes;
  }

  diceRollingMenu() {
    this.showDiceMenu = !this.showDiceMenu;
  }

  getInputs(which: string): FormArray<FormControl<number>> {
    return this.mainForm.get(which) as FormArray<FormControl<number>>;
  }
}
