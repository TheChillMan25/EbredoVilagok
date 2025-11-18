import { Component } from '@angular/core';
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
import { armours, weapons } from '../../../shared/models/equipment';
import { Armour } from '../../../shared/models/character_interfaces';
import {
  CharacterDisadvantages,
  CharacterVirtues,
} from '../../../shared/models/virtues_disadvantages';
import {
  foodRations,
  items,
  medicalItems,
  specialDrinks,
} from '../../../shared/models/items';
import { Character } from '../../../shared/models/models';
import { CharacterService } from '../../../shared/services/character/character.service';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-karakter',
  imports: [
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
export class KarakterComponent {
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

  weapons = weapons.map((weapon) => weapon.name);
  armours: Armour[] = armours;

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

  foods = foodRations.map((food) => ({
    name: food.name,
    portion: food.portion,
  }));
  specialIndex = 0;
  specialItems = medicalItems
    .map((item) => item.name)
    .concat(specialDrinks.map((drink) => drink.name));

  medicalItems = medicalItems.map((item) => item.name);
  specialDrinks = specialDrinks.map((drink) => drink.name);
  otherItems = items.map((item) => item.name);

  showDiceMenu: boolean = false;

  constructor(
    private fb: FormBuilder,
    private charService: CharacterService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log(this.medicalItems.length, this.specialDrinks.length);
    setBackground('paper_bg.jpg');
    this.initForm();
    /* this.mainForm.patchValue({ name: 'Stefan' });
    this.mainForm.patchValue({ stats: { mental: { esz: 10 } } });
    console.log(this.mainForm.get('stats.mental.esz')?.value); */
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
            0,
            [Validators.required, Validators.min(-3), Validators.max(3)],
          ],
          ugyesseg: [
            0,
            [Validators.required, Validators.min(-3), Validators.max(3)],
          ],
          kitartas: [
            0,
            [Validators.required, Validators.min(-3), Validators.max(3)],
          ],
        }),
        mental: this.fb.group({
          esz: [
            0,
            [Validators.required, Validators.min(-3), Validators.max(3)],
          ],
          fortely: [
            0,
            [Validators.required, Validators.min(-3), Validators.max(3)],
          ],
          akaratero: [
            0,
            [Validators.required, Validators.min(-3), Validators.max(3)],
          ],
        }),
        main: this.fb.group({
          hp: [1, Validators.min(1)],
          sp: [1, Validators.min(1)],
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
        otherItems: this.fb.array<FormControl<number>>([
          new FormControl(),
          new FormControl(),
          new FormControl(),
          new FormControl(),
          new FormControl(),
        ]),
      }),
    });
  }

  /**
   * Creates character with given form data. Not given data means empty character property.
   * @param random If true, creates a random character.
   */
  createCharacter(random: boolean = false) {
    if (!this.mainForm.valid && !random) {
      this.errorMessage =
        'Karakter nem készíthető el, tölts ki minden kötelező mezőt!';
      return;
    }
    const formValue = this.mainForm.value;
    if (random) {
      if (formValue.name === '') {
        this.errorMessage = 'Adj meg egy nevet!';
        return;
      }
      console.log('Creating random character...');
      let randomCharacter =
      createRandomCharacter(formValue.name);
      console.log(randomCharacter);
      this.charService
        .addCharacter(randomCharacter)
        .then(() => {
          this.mainForm.reset();
        })
        .catch((error) => {
          console.error('Hiba a karakter létrehozása során: ', error);
        })
        .finally(() => {
          console.log('Karakter létrehozva: ', randomCharacter);
          this.router.navigateByUrl('/profil');
        });
    } else {
      console.log('Creating new character');
      let newCharacter: Omit<Character, 'id'> = {
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
          otherItems: [],
          weaponItems: [],
        },
      };
      console.log(newCharacter);
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
