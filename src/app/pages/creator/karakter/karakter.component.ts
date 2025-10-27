import { Component } from '@angular/core';
import {
  convertSpeciesNameToKey,
  createStats,
  getStat,
  setBackground,
  setDisplay,
} from '../../../shared/functional/functions';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatLabel, MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NationData } from '../../../shared/models/NationData';
import { species } from '../../world/species/species_desc_data';
import { MatIcon } from '@angular/material/icon';
import { armours, weapons } from '../../../shared/models/equipment';
import { Armour, Weapon } from '../../../shared/models/character_interfaces';
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
import { classes } from '../../../shared/models/classes';

@Component({
  selector: 'app-karakter',
  imports: [
    MatLabel,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatIcon,
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
        virtues: this.fb.group({
          virtue1: [''],
          virtue2: [''],
        }),
        disadvantage: [''],
      }),
      items: this.fb.group({
        mandatoryItems: this.fb.group({
          food: [''],
          item1: [''],
          item2: [''],
          item3: [''],
        }),
        otherItems: this.fb.group({
          item1: [''],
          item2: [''],
          item3: [''],
          item4: [''],
          item5: [''],
        }),
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
        this.errorMessage = ' Adj meg egy nevet!';
        return;
      }
      console.log('Creating random character...');
      let stats = createStats();
      let randomCharacter: Omit<Character, 'id'> = {
        name: formValue.name || '',
        species: NationData.map((nation) => nation.nationName)[
          Math.floor(Math.random() * 17)
        ],
        class: classes[Math.floor(Math.random() * 4)],
        level: 1,
        specialProperties: {
          speciesProperty: Math.floor(Math.random() * 6),
          home: Math.floor(Math.random() * 6),
        },
        stats: {
          physical: {
            ero: getStat(stats),
            ugyesseg: getStat(stats),
            kitartas: getStat(stats),
          },
          mental: {
            esz: getStat(stats),
            fortely: getStat(stats),
            akaratero: getStat(stats),
          },
          main: {
            hp: Math.ceil(Math.random() * 6),
            sp:
              Math.ceil(Math.random() * 4) +
              Math.ceil(Math.random() * 4) +
              Math.ceil(Math.random() * 4),
          },
        },
        equipment: {
          left: Math.floor(Math.random() * weapons.length - 1),
          right: Math.floor(Math.random() * weapons.length - 1),
          armour: Math.floor(Math.random() * armours.length - 1),
        },
        virtues: {
          virtues: [
            Math.floor(Math.random() * this.virtues.length - 1),
            Math.floor(Math.random() * this.virtues.length - 1),
          ],
          disadv: [Math.floor(Math.random() * this.disadvantages.length - 1)],
        },
        items: {
          food: [Math.floor(Math.random() * foodRations.length)],
          specialItems: [
            Math.floor(Math.random() * this.specialItems.length),
            Math.floor(Math.random() * this.specialItems.length),
            Math.floor(Math.random() * this.specialItems.length),
          ],
          otherItems: [
            Math.floor(Math.random() * 100),
            Math.floor(Math.random() * 100),
            Math.floor(Math.random() * 100),
            Math.floor(Math.random() * 100),
            Math.floor(Math.random() * 100),
          ],
          weaponItems: [],
        },
      };
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
      let newCharacter: Omit<Character, 'id'> = {
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
          virtues: {
            virtue1: '',
            virtue2: '',
          },
          disadvantage: '',
        },
        items: formValue.items || {
          specialItems: [],
          otherItems: [],
          weaponItems: [],
        },
      };

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
    const diceMenu = document.getElementById('dice-rolling-menu');
    if (diceMenu && diceMenu.style.display === 'none')
      setDisplay(diceMenu, 'flex');
    else if (diceMenu && diceMenu.style.display !== 'none')
      setDisplay(diceMenu, 'none');
  }
}
