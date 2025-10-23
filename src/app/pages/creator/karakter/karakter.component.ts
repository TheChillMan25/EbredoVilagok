import { Component } from '@angular/core';
import {
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

  medicalItems = medicalItems.map((item) => item.name);
  specialDrinks = specialDrinks.map((drink) => drink.name);
  otherItems = items.map((item) => item.name);

  constructor(
    private fb: FormBuilder,
    private charService: CharacterService,
    private router: Router
  ) {}

  ngOnInit() {
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
        firstVirtue: [''],
        secondVirtue: [''],
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
    if (random) console.log('Creating random character...');

    const formValue = this.mainForm.value;
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
        firstVirtue: '',
        secondVirtue: '',
        disadvantage: '',
      },
      items: formValue.items || {
        mandatoryItems: {
          food: '',
          item1: '',
          item2: '',
          item3: '',
        },
        otherItems: {
          item1: '',
          item2: '',
          item3: '',
          item4: '',
          item5: '',
        },
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

  selectHome(index: any) {
    this.currentHome = this.currentSpeciesHomes[index];
  }

  setRelevantSpeciesData(value: any) {
    let currentSpecies = this.convertSpeciesNameToKey(value);
    this.currentSpeciesProperties =
      species[currentSpecies!.landID][
        currentSpecies!.speciesID
      ].nationalProperties;
    this.currentSpeciesHomes =
      species[currentSpecies!.landID][currentSpecies!.speciesID].homes;
  }

  convertSpeciesNameToKey(
    name: string
  ): { landID: string; speciesID: number } | undefined {
    if (['Folyóköz', 'Magasföld', 'Holtág'].includes(name)) {
      return {
        landID: 'folyokoz',
        speciesID: ['Folyóköz', 'Magasföld', 'Holtág'].indexOf(name),
      };
    } else if (['Denn Karadenn', 'Cha’Me’Rén', 'Doma Altiora'].includes(name)) {
      return {
        landID: 'toronyvarosok',
        speciesID: ['Denn Karadenn', 'Cha’Me’Rén', 'Doma Altiora'].indexOf(
          name
        ),
      };
    } else if (['Édd', 'Vadin', 'Monor'].includes(name)) {
      return {
        landID: 'kelet_nepe',
        speciesID: ['Édd', 'Vadin', 'Monor'].indexOf(name),
      };
    } else if (['Rügysze', 'Kérgeláb', 'Kalapos'].includes(name)) {
      return {
        landID: 'novenyszerzetek',
        speciesID: ['Rügysze', 'Kérgeláb', 'Kalapos'].indexOf(name),
      };
    } else if (
      ['Au-1. Fenntartó', 'Au-2. Utód', 'Au-Cust. Örző'].includes(name)
    ) {
      return {
        landID: 'gepszulottek',
        speciesID: ['Au-1. Fenntartó', 'Au-2. Utód', 'Au-Cust. Örző'].indexOf(
          name
        ),
      };
    } else
      return {
        landID: 'atkozottak',
        speciesID: ['Abominus', 'Vámpír'].indexOf(name),
      };
  }

  diceRollingMenu() {
    const diceMenu = document.getElementById('dice-rolling-menu');
    if (diceMenu && diceMenu.style.display === 'none')
      setDisplay(diceMenu, 'flex');
    else if (diceMenu && diceMenu.style.display !== 'none')
      setDisplay(diceMenu, 'none');
  }
}
