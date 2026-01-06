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

  weapons = [];
  armours = [] as Armour[];

  virtues = CharacterVirtues.map((virtue) => virtue.name);
  disadvantages = CharacterDisadvantages.map((disadv) => disadv.name);

  statsForm = [
    {
      controlName: 'physical',
      fields: [
        { groupName: 'ero', labelText: 'Erő' },
        { groupName: 'ugyesseg', labelText: 'Ügyesség' },
        { groupName: 'kitartas', labelText: 'Kitartás' },
      ],
      interval: { min: -3, max: 3 },
    },
    {
      controlName: 'mental',
      fields: [
        { groupName: 'esz', labelText: 'Ész' },
        { groupName: 'fortely', labelText: 'Fortély' },
        { groupName: 'akaratero', labelText: 'Akaraterő' },
      ],
      interval: { min: -3, max: 3 },
    },
    {
      controlName: 'main',
      fields: [
        { groupName: 'hp', labelText: 'HP' },
        { groupName: 'sp', labelText: 'SP' },
      ],
      interval: { min: 1, max: 20 },
    },
  ];

  foods = [] as Food[];
  specialIndex = 0;
  specialItems = [] as SpecialItem[];

  /* medicalItems = medicalItems.map((item) => item.name);
  specialDrinks = specialDrinks.map((drink) => drink.name); */
  generalItems = []; /* items.map((item) => item.name); */

  showDiceMenu: boolean = false;

  constructor(
    private fb: FormBuilder,
    private charService: CharacterService,
    private router: Router,
    private itemService: ItemService
  ) {
    this.weapons = this.itemService
      .getItemsByGroup('weapons')
      .map((weapon: Weapon) => weapon.name);
    this.armours = this.itemService.getItemsByGroup('armours');
    this.foods = this.itemService.getItemsByGroup('food').map((food: Food) => ({
      name: food.name,
      uses: food.uses,
    }));
    this.specialItems = itemService
      .getItemsByGroup('allSpecial')
      .map((item: SpecialItem) => item.name);
    this.generalItems = itemService
      .getItemsByGroup('general')
      .map((item: any) => item.name);
  }

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

  ngOnInit() {
    setBackground('paper_bg');
    this.initForm();
  }

  initForm() {
    this.mainForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      species: ['', Validators.required],
      class: ['', Validators.required],
      specialProperties: this.fb.group({
        speciesProperty: ['', Validators.required],
        home: ['', Validators.required],
      }),
      stats: this.fb.group({
        physical: this.fb.group({
          ero: [
            '',
            [Validators.required, Validators.min(-3), Validators.max(3)],
          ],
          ugyesseg: [
            '',
            [Validators.required, Validators.min(-3), Validators.max(3)],
          ],
          kitartas: [
            '',
            [Validators.required, Validators.min(-3), Validators.max(3)],
          ],
        }),
        mental: this.fb.group({
          esz: [
            '',
            [Validators.required, Validators.min(-3), Validators.max(3)],
          ],
          fortely: [
            '',
            [Validators.required, Validators.min(-3), Validators.max(3)],
          ],
          akaratero: [
            '',
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
    const formValue = this.mainForm.value;

    let newCharacter: Omit<Character, 'id' | 'userId'> = {
      currentAdventure: '',
      name: formValue.name || '',
      species: formValue.species || '',
      class: formValue.class || '',
      level: 1,
      specialProperties: formValue.specialProperties || {
        speciesProperty: 0,
        home: 0,
      },
      stats: formValue.stats || {
        physical: {
          ero: 1,
          ugyesseg: 1,
          kitartas: 1,
        },
        mental: {
          esz: 1,
          fortely: 1,
          akaratero: 1,
        },
        main: {
          hp: 1,
          sp: 1,
        },
      },
      equipment: formValue.equipment || {
        left: '',
        right: '',
        armour: '',
      },
      virtues: formValue.virtues || {
        virtues: [],
        disadvantage: [],
      },
      items: formValue.items || {
        food: [],
        specialItems: [],
        generalItems: [],
        weaponItems: [],
      },
      wounds: {
        small: 0,
        large: 0,
      },
    };

    if (
      this.itemService.getItem('weapons', newCharacter.equipment.left)
        .handed === 2 &&
      this.itemService.getItem('weapons', newCharacter.equipment.right)
        .handed !== 0
    ) {
      this.errorMessage =
        'Két kezes fegyver mellé nem lehet egy másik fegyvered.';
      return;
    } else if (
      this.itemService.getItem('weapons', newCharacter.equipment.right)
        .handed === 2 &&
      this.itemService.getItem('weapons', newCharacter.equipment.left)
        .handed !== 0
    ) {
      this.errorMessage =
        'Két kezes fegyver mellé nem lehet egy másik fegyvered.';
      return;
    }

    this.charService
      .addCharacter(newCharacter)
      .then(() => {
        this.mainForm.reset();
      })
      .catch((error) => {
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
      equipment: random.equipment,
      virtues: {
        virtues: random.virtues.virtues,
        disadvantage: random.virtues.disadv,
      },
      items: random.items,
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
