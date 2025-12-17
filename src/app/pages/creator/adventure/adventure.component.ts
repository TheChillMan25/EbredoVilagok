import { Component, HostListener, ViewChild } from '@angular/core';
import { setBackground } from '../../../shared/functional/functions';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  AbstractControl,
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
import {
  Adventure,
  AdventureEvent,
  Character,
  NPC,
} from '../../../shared/models/models';
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
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatCardFooter,
    MatButton,
  ],
  templateUrl: './adventure.component.html',
  styleUrl: './adventure.component.scss',
})
export class AdventureComponent implements CanComponentDeactivate {
  @ViewChild(MapContainerComponent) map!: MapContainerComponent;

  skipLeaveConfirm: boolean = false;

  showEvents: boolean = false;
  showNPCs: boolean = false;
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

  constructor(
    private fb: FormBuilder,
    private charService: CharacterService,
    private advService: AdventureService,
    private router: Router
  ) {}

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.skipLeaveConfirm) return true;
    if (this.adventureName.dirty || this.events.length > 0)
      return confirm(
        'Nem mentett változásaid vannak! Biztosan elhagyod az oldalt?'
      );
    return true;
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.skipLeaveConfirm) return;
    if (this.adventureName.dirty || this.events.length > 0) {
      $event.returnValue = true;
    }
  }

  ngOnInit() {
    setBackground('paper_bg');
    this.initForms();

    this.myCharacters$ = this.charService.getAllCharacters();

    this.locations = cityLocations
      .concat(townLocations)
      .concat(forestLocations)
      .concat(mountainLocations)
      .concat(hillLocations)
      .concat(waterLocations);
  }

  showUIs(which: 'events' | 'npcs') {
    switch (which) {
      case 'events':
        this.showEvents = true;
        this.resetForm(this.eventForm);
        break;
      case 'npcs':
        this.showNPCs = true;
        this.resetForm(this.npcForm);
        break;
    }
    this.action = 'Hozzáad';
    this.actionIcon = 'add';
  }

  hideUIs() {
    this.showEvents = false;
    this.showNPCs = false;
    this.modify = false;
    this.modifyingIndex = null;
  }

  initForms() {
    this.eventForm = this.fb.group({
      location: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      desc: [''],
      story: [''],
    });

    this.npcForm = this.fb.group({
      name: ['', [Validators.required]],
      attitude: ['neutral', [Validators.required]],
      actions: this.fb.group(
        {
          talk: [false],
          trade: [false],
          fight: [false],
          steal: [false],
        },
        { validators: [this.checkActions()] }
      ),
      character: [''],
    });

    this.toggleActions('neutral');

    this.npcForm
      .get('attitude')
      ?.valueChanges.subscribe((att: 'neutral' | 'hostile') => {
        this.attitude = att;
        this.toggleActions(att);
      });
  }

  private toggleActions(att: 'neutral' | 'hostile') {
    const { talk, trade, fight, steal } = this.getActions().controls;

    if (att === 'neutral') {
      talk.enable();
      trade.enable();
      fight.disable();
      steal.disable();
    } else {
      talk.disable();
      trade.disable();
      fight.enable();
      steal.enable();
    }
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
        this.npcForm.patchValue({
          name: npc?.name,
          attitude: npc?.attitude,
          actions: npc?.actions,
          character: npc?.character,
        });
    }
  }

  resetForm(resetable: FormGroup) {
    if (resetable === this.npcForm) {
      this.npcError = '';
      resetable.reset({
        name: '',
        attitude: 'neutral',
        actions: {
          talk: false,
          trade: false,
          fight: false,
          steal: false,
        },
        character: '',
      });
      this.attitude = 'neutral';
      this.toggleActions('neutral');
    } else {
      this.eventError = '';
      resetable.reset();
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
      if (modifiedNPC) {
        modifiedNPC.name = npcValues.name;
        modifiedNPC.attitude = npcValues.attitude;
        modifiedNPC.actions = npcValues.actions;
        modifiedNPC.character = npcValues.character;
        this.modify = false;
        this.modifyingIndex = null;
      }
    } else {
      if (this.attitude === 'hostile' && !npcValues.character) {
        this.npcError = 'Adj meg egy karaktert';
        return;
      }
      let npc: NPC = {
        id: `${this.selectedAdventureEvent?.id}-${this.selectedAdventureEvent?.NPCs.length}`,
        name: npcValues.name,
        actions: npcValues.actions,
        attitude: npcValues.attitude,
        character: npcValues.character,
      };
      this.selectedAdventureEvent?.NPCs.push(npc);
    }
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

  getActions(): FormGroup<{
    talk: FormControl<boolean>;
    trade: FormControl<boolean>;
    fight: FormControl<boolean>;
    steal: FormControl<boolean>;
  }> {
    return this.npcForm.get('actions') as FormGroup<{
      talk: FormControl<boolean>;
      trade: FormControl<boolean>;
      fight: FormControl<boolean>;
      steal: FormControl<boolean>;
    }>;
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
      const values = control.value;
      if (!values) {
        return null;
      }
      const hasTrue = Object.values(values).some((v) => v === true);
      return hasTrue ? null : { atLeastOne: true };
    };
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
      let adventure: Omit<Adventure, 'id'> = {
        name: this.adventureName.value,
        events: this.events,
        players: [],
        currentPlayer: '',
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
}
