import { Component, ViewChild } from '@angular/core';
import { setBackground } from '../../../shared/functional/functions';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { AdventureEvent, Character, NPC } from '../../../shared/models/models';
import { MatSelect, MatOption } from '@angular/material/select';
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
import { MapContainerComponent } from '../../../shared/functional/map-container/map-container.component';
import {
  cityLocations,
  forestLocations,
  Location,
  townLocations,
} from '../../../shared/models/map_locations';

@Component({
  selector: 'app-adventure',
  imports: [
    AsyncPipe,
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
    MatOption,
    MapContainerComponent,
  ],
  templateUrl: './adventure.component.html',
  styleUrl: './adventure.component.scss',
})
export class AdventureComponent {
  @ViewChild(MapContainerComponent) map!: MapContainerComponent;
  showEvents: boolean = false;
  showUIContainer: boolean = false;
  showNPCs: boolean = false;
  modifyEvent: boolean = false;
  attitude: string = 'neutral';

  modifyingIndex: number | null = null;

  selectedEventIndex: number = -1;

  eventAction: string = 'Hozzáad';
  eventActionIcon: string = 'add';

  locations: Location[] = [];

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

    this.locations = cityLocations
      .concat(townLocations)
      .concat(forestLocations);
    /*window.onbeforeunload = (e) => {
      e.preventDefault();
    };*/
  }

  showUIs(which: 'events' | 'npcs') {
    this.showUIContainer = true;
    switch (which) {
      case 'events':
        this.showEvents = true;
        this.resetForm(this.eventForm);
        break;
      case 'npcs':
        this.showNPCs = true;
        break;
    }
    this.eventAction = 'Hozzáad';
    this.eventActionIcon = 'add';
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
    const actions = this.fb.array<FormControl<boolean | null>>(
      [
        new FormControl(false),
        new FormControl(false),
        new FormControl(false),
        new FormControl(false),
      ],
      { validators: [this.checkActions()] }
    );

    this.npcForm = this.fb.group({
      name: ['', [Validators.required]],
      attitude: ['neutral', [Validators.required]],
      actions,
      character: [''],
    });

    this.toggleActions('neutral'); // első betöltés

    this.npcForm
      .get('attitude')
      ?.valueChanges.subscribe((att: 'neutral' | 'hostile') => {
        this.attitude = att;
        this.toggleActions(att);
      });
  }

  private toggleActions(att: 'neutral' | 'hostile') {
    const acts = this.getActions();
    if (att === 'neutral') {
      acts.at(0).enable();
      acts.at(1).enable();
      acts.at(2).disable();
      acts.at(3).disable();
    } else {
      acts.at(0).disable();
      acts.at(1).disable();
      acts.at(2).enable();
      acts.at(3).enable();
    }
  }

  addEvent() {
    if (!this.eventForm.valid) {
      console.error('Hibás kitöltés');
      return;
    }
    const eventValues = this.eventForm.value;
    if (this.modifyEvent && this.modifyingIndex !== null) {
      let modifiedEvent = this.events[this.modifyingIndex];
      modifiedEvent.name = eventValues.name;
      modifiedEvent.location = eventValues.location;
      modifiedEvent.desc = eventValues.desc;
      modifiedEvent.story = eventValues.story;
      this.modifyEvent = false;
      this.modifyingIndex = null;
    } else {
      let event: AdventureEvent = {
        id: this.events.length,
        name: eventValues.name,
        location: eventValues.location,
        desc: eventValues.desc,
        story: eventValues.story,
        NPCs: [],
      };
      this.events.push(event);
      console.log(this.events);
    }
    this.hideUIs();
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

  openEditEvent(index: number) {
    this.modifyEvent = true;
    this.modifyingIndex = index;
    this.showUIs('events');
    this.eventAction = 'Módosít';
    this.eventActionIcon = 'settings';
    let event = this.events[index];
    this.eventForm.patchValue({
      name: event.name,
      location: event.location,
      desc: event.desc,
      story: event.story,
    });
  }

  resetForm(resetable: FormGroup) {
    if (resetable === this.npcForm) {
      resetable.reset({
        name: '',
        attitude: 'neutral',
        actions: [false, false, false, false],
        character: '',
      });
      this.attitude = 'neutral';
      this.toggleActions('neutral');
    } else {
      resetable.reset();
    }

    Object.keys(resetable.controls).forEach((field) => {
      const control = resetable.get(field);
      if (control instanceof FormControl) {
        control.setErrors(null);
      }
    });
  }

  addNPC() {
    if (!this.npcForm.valid) {
      console.error('Hibás kitöltés');
      this.npcError = 'Töltsd ki a kötelező mezőket';
      return;
    }
    const npcValues = this.npcForm.value;

    if (this.attitude === 'hostile' && !npcValues.character) {
      this.npcError = 'Adj meg egy karaktert';
      return;
    }
    let npc: NPC = {
      id: `${this.selectedAdventureEvent?.name}-${this.selectedAdventureEvent?.NPCs.length}`,
      name: npcValues.name,
      actions: npcValues.actions,
      attitude: npcValues.attitude,
      character: npcValues.character,
    };
    this.selectedAdventureEvent?.NPCs.push(npc);
    this.hideUIs();
    this.resetForm(this.npcForm);
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
          return character.name;
        }
        return '';
      });
    });
    return '';
  }

  checkActions(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const arr = control.value as boolean[];
      const hasTrue = Array.isArray(arr) && arr.some((v) => v === true);
      return hasTrue ? null : { atLeastOne: true };
    };
  }
}
