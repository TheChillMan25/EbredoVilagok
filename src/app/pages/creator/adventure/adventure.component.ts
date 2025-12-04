import { Component } from '@angular/core';
import { setBackground } from '../../../shared/functional/functions';
import { MatIcon } from '@angular/material/icon';
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
import { AdventureEvent, Character, NPC } from '../../../shared/models/models';
import { MatSelect, MatOption } from '@angular/material/select';
import * as L from 'leaflet';
import { NationData } from '../../../shared/models/NationData';
import {
  CharacterDisadvantages,
  CharacterVirtues,
} from '../../../shared/models/virtues_disadvantages';
import { armours, weapons } from '../../../shared/models/equipment';
import {
  foodRations,
  items,
  medicalItems,
  specialDrinks,
} from '../../../shared/models/items';
import { CharacterService } from '../../../shared/services/character/character.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-adventure',
  imports: [
    AsyncPipe,
    MatIcon,
    MatCheckboxModule,
    MatRadioModule,
    NgClass,
    MatFormFieldModule,
    MatLabel,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelect,
    MatOption,
  ],
  templateUrl: './adventure.component.html',
  styleUrl: './adventure.component.scss',
})
export class AdventureComponent {
  showEvents: boolean = false;
  showUIContainer: boolean = false;
  showNPCs: boolean = false;
  modifyEvent: boolean = false;
  attitude: string = 'neutral';

  modifyingIndex: number | null = null;

  selectedEventIndex: number = -1;

  eventAction: string = 'Hozzáad';
  eventActionIcon: string = 'add';

  locations = ['Phunor', 'Felba', 'Nulina'];

  selectedAdventureEvent?: AdventureEvent;
  events: AdventureEvent[] = [];

  eventForm!: FormGroup;
  npcForm!: FormGroup;
  npcError: string = '';

  npcCharacter = {
    species: NationData.map((nation) => nation.nationName),
    weapons: weapons.map((weapon) => weapon.name),
    armours: armours,
    virtues: CharacterVirtues.map((virtue) => virtue.name),
    disadvantages: CharacterDisadvantages.map((disadv) => disadv.name),
    food: foodRations.map((food) => food.name),
    specialItems: medicalItems
      .map((item) => item.name)
      .concat(specialDrinks.map((item) => item.name)),
    otherItems: items.map((item) => item.name),
  };

  myCharacters$!: Observable<Character[]>;

  constructor(private fb: FormBuilder, private charService: CharacterService) {}

  ngOnInit() {
    setBackground('paper_bg.jpg');
    this.initForms();

    this.myCharacters$ = this.charService.getAllCharacters();
    this.myCharacters$.forEach((char) => {
      console.log(char);
    });
  }

  ngAfterViewInit() {
    const imageHeight = 1350;
    const imageWidth = 1800;

    const bounds: L.LatLngBoundsExpression = [
      [0, 0],
      [imageHeight, imageWidth],
    ];
    const map = L.map('map-container', {
      crs: L.CRS.Simple,
      minZoom: 0,
      maxZoom: 2,
      zoom: 0,
      center: [1350 / 2, 1800 / 2],
      maxBounds: bounds,
      maxBoundsViscosity: 1.0,
    });

    L.imageOverlay('assets/img/misc/tmp_map.jpg', bounds).addTo(map);

    map.fitBounds(bounds);
  }

  showUIs(which: 'events' | 'npcs') {
    this.showUIContainer = true;
    switch (which) {
      case 'events':
        this.showEvents = true;
        break;
      case 'npcs':
        this.showNPCs = true;
        break;
    }
  }

  hideUIs() {
    this.showUIContainer = false;
    this.showEvents = false;
    this.showNPCs = false;
  }

  initForms() {
    this.eventForm = this.fb.group({
      location: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(5)]],
      desc: [''],
      story: [''],
    });
    this.npcForm = this.fb.group({
      name: ['', [Validators.required]],
      attitude: ['neutral', [Validators.required]],
      actions: this.fb.array<FormControl<boolean | null>>([
        new FormControl(false),
        new FormControl(false),
        new FormControl(false),
        new FormControl(false),
      ]),
      character: ['', [Validators.required]],
    });
  }

  addEvent() {
    if (!this.eventForm.valid) {
      console.error('Hibás kitöltés');
      return;
    }
    const eventValues = this.eventForm.value;
    console.log(this.modifyEvent, this.modifyingIndex);
    if (this.modifyEvent && this.modifyingIndex !== null) {
      console.log('Modifying');
      let modifiedEvent = this.events[this.modifyingIndex];
      modifiedEvent.name = eventValues.name;
      modifiedEvent.location = eventValues.location;
      modifiedEvent.desc = eventValues.desc;
      modifiedEvent.story = eventValues.story;
      this.modifyEvent = false;
      this.modifyingIndex = null;
    } else {
      console.log('Create new');
      let event: AdventureEvent = {
        id: this.events.length,
        name: eventValues.name,
        location: eventValues.location,
        desc: eventValues.desc,
        story: eventValues.story,
        NPCs: [],
      };
      this.events.push(event);
    }
    this.resetForm(this.eventForm);
  }

  selectEvent(index: number) {
    if (this.selectedAdventureEvent) {
      if (this.events.indexOf(this.selectedAdventureEvent) !== index) {
        this.selectedAdventureEvent = this.events[index];
      }
    } else {
      this.selectedAdventureEvent = this.events[index];
    }
    this.selectedEventIndex = index;
    console.log(this.selectedAdventureEvent);
  }

  openEditEvent(index: number) {
    this.modifyEvent = true;
    this.modifyingIndex = index;
    this.eventAction = 'Módosít';
    this.eventActionIcon = 'settings';
    this.showUIs('events');
    let event = this.events[index];
    this.eventForm.patchValue({
      name: event.name,
      location: event.location,
      desc: event.desc,
      story: event.story,
    });
  }

  resetForm(resetable: FormGroup) {
    this.hideUIs();
    resetable.reset();
    Object.keys(resetable.controls).map((field) => {
      const control = resetable.get(field);
      if (control instanceof FormControl) {
        control?.setErrors(null);
      }
    });
  }

  addNPC() {
    if (!this.npcForm.valid) {
      console.error('Hibás kitöltés');
      console.log(this.npcForm.value);
      this.npcError = 'Töltsd ki a kötelező mezőket';
      return;
    }
    const npcValues = this.npcForm.value;
    console.log(npcValues);
    let npc: NPC = {
      id: `${this.selectedAdventureEvent?.name}-${this.selectedAdventureEvent?.NPCs.length}`,
      name: npcValues.name,
      actions: npcValues.actions,
      attitude: npcValues.attitude,
      character: npcValues.character,
    };
    this.selectedAdventureEvent?.NPCs.push(npc);
    this.resetForm(this.npcForm);
    console.log(this.selectedAdventureEvent);
    this.hideUIs();
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

  getActions(): FormArray<FormControl<boolean>> {
    return this.npcForm.get('actions') as FormArray<FormControl<boolean>>;
  }

  getCharacterName(id: string): string {
    this.myCharacters$.forEach((char) => {
      char.forEach((character) => {
        if (character.id === id) {
          console.log(character.name);
          return character.name;
        }
        return '';
      });
    });
    return '';
  }
}
