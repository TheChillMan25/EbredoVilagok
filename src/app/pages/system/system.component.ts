import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { setBackground } from '../../shared/functional/functions';
import { CharacterMainComponent } from './character/character-main/character-main.component';
import { CharacterSpeciesComponent } from './character/character-species/character-species.component';
import { CharacterVirtuesComponent } from './character/character-virtues/character-virtues.component';
import { CharacterDisadvantagesComponent } from './character/character-disadvantages/character-disadvantages.component';
import { CharacterStatsComponent } from './character/character-stats/character-stats.component';
import { CharacterEquipmentComponent } from './character/character-equipment/character-equipment.component';
import { CharacterItemsComponent } from './character/items/character-items/character-items.component';
import { AdventureMainComponent } from './adventure/adventure-main/adventure-main.component';
import { AdventureEventComponent } from './adventure/adventure-event/adventure-event.component';
import { AdventureNpcComponent } from './adventure/adventure-npc/adventure-npc.component';
import { ActionsMainComponent } from './actions/actions-main/actions-main.component';
import { ActionsCampComponent } from './actions/camp/actions-camp/actions-camp.component';
import { ActionsCamp2Component } from './actions/camp/actions-camp2/actions-camp2.component';
import { ActionsFightComponent } from './actions/actions-fight/actions-fight.component';
import { ActionsLootComponent } from './actions/harvesting/actions-loot/actions-loot.component';
import { ActionsLoot2Component } from './actions/harvesting/actions-loot2/actions-loot2.component';
import { ActionsLoot3Component } from './actions/harvesting/actions-loot3/actions-loot3.component';
import { MandatoryItemsComponent } from './character/items/mandatory-items/mandatory-items.component';
import { SpecialItemsComponent } from './character/items/special-items/special-items.component';
import { CigarItemsComponent } from './character/items/cigar-items/cigar-items.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-system',
  imports: [
    MatIcon,
    CharacterMainComponent,
    CharacterSpeciesComponent,
    CharacterVirtuesComponent,
    CharacterDisadvantagesComponent,
    CharacterStatsComponent,
    CharacterEquipmentComponent,
    CharacterItemsComponent,
    AdventureMainComponent,
    AdventureEventComponent,
    AdventureNpcComponent,
    ActionsMainComponent,
    ActionsCampComponent,
    ActionsCamp2Component,
    ActionsFightComponent,
    ActionsLootComponent,
    ActionsLoot2Component,
    ActionsLoot3Component,
    MandatoryItemsComponent,
    SpecialItemsComponent,
    CigarItemsComponent,
    NgClass
],
  templateUrl: './system.component.html',
  styleUrl: './system.component.scss',
})
export class SystemComponent {
  background: string = 'table.jpg';
  activeSegmentName: 'character' | 'adventure' | 'actions' = 'character';
  activePageIndex: number = 0;
  maxPageIndex: number = 9;
  visibleMarkers: boolean = true;

  mainPageIndexes = {
    char: 0,
    adv: 5,
    act: 7,
  };

  ngOnInit(): void {
    setBackground(this.background);
    this.setActiveSegment('character');
  }

  setActiveSegment(segment: 'character' | 'adventure' | 'actions'): void {
    this.handleMarkerVisualization(segment);
    this.activePageIndex = 0;
    switch (segment) {
      case 'character': {
        this.activePageIndex = this.mainPageIndexes['char'];
        break;
      }
      case 'adventure': {
        this.activePageIndex = this.mainPageIndexes['adv'];
        break;
      }
      case 'actions': {
        this.activePageIndex = this.mainPageIndexes['act'];
        break;
      }
    }
  }

  prev(): void {
    if (this.activePageIndex > 0) {
      this.activePageIndex--;
      this.checkPage();
      this.manageScroll();
    }
    return;
  }

  next(): void {
    if (this.activePageIndex < this.maxPageIndex) {
      this.activePageIndex++;
      this.checkPage();
      this.manageScroll();
    }
    return;
  }

  setActivePage(index: number) {
    this.activePageIndex = index;
  }

  checkPage() {
    if (this.activePageIndex < this.mainPageIndexes['adv']) {
      this.handleMarkerVisualization('character');
    } else if (
      this.activePageIndex >= this.mainPageIndexes['adv'] &&
      this.activePageIndex < this.mainPageIndexes['act']
    ) {
      this.handleMarkerVisualization('adventure');
    } else {
      this.handleMarkerVisualization('actions');
    }
  }

  handleMarkerVisualization(segment: 'character' | 'adventure' | 'actions') {
    document
      .getElementById(this.activeSegmentName)
      ?.classList.remove('selectedMarker');
    this.activeSegmentName = segment;
    document.getElementById(segment)?.classList.add('selectedMarker');
  }

  toggleMarkers() {
    this.visibleMarkers = !this.visibleMarkers;
  }

  manageScroll() {
    const container = document.getElementById('page-text-container');
    if (container) {
      container.scrollTop = 0;
    } else {
      console.warn('Nincsen #page-text-container-hez');
    }
    const textContainers = document.querySelectorAll('.page-text-container');
    if (textContainers) {
      textContainers.forEach((page) => {
        page.scrollTop = 0;
      });
    } else {
      console.warn('Nincsenek .page-text-container-ek');
    }
  }
}
