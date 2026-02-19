import { Component, HostListener } from '@angular/core';
import {
  convertSpeciesNameToKey,
  createCharacter,
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
  CharacterCreationErrorCauses,
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
  dontWarnBeforeLeave = false;

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
  ) { }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.dontWarnBeforeLeave) return true;
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
      name: ['', [noWhitespaceValidator, Validators.required, Validators.minLength(3)]],
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

  async createCharacter() {
    try {
      this.isLoading = true;
      const newCharacter = createCharacter(this.mainForm, this.itemService)
      await this.charService
        .addCharacter(newCharacter)
      console.log('Karakter létrehozva: ', newCharacter);
      this.dontWarnBeforeLeave = true;
      localStorage.setItem('visibleContainerOnProfile', 'characters');
      this.router.navigateByUrl('/profil');
    } catch (error: any) {
      this.isLoading = false;
      console.error('Hiba a karakter létrehozása során: ', error);
      if (error.cause === CharacterCreationErrorCauses.InvalidFormData) {
        this.errorMessage = error.message;
      }
      return;
    }
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
