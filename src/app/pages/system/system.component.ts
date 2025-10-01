import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { setBackground } from '../../shared/functional/functions';
import { CharacterMainComponent } from './character/character-main/character-main.component';
import { CharacterSpeciesComponent } from './character/character-species/character-species.component';
import { CharacterVirtuesComponent } from './character/character-virtues/character-virtues.component';
import { CharacterDisadvantagesComponent } from './character/character-disadvantages/character-disadvantages.component';
import { CharacterStatsComponent } from './character/character-stats/character-stats.component';
import { CharacterEquipmentComponent } from './character/character-equipment/character-equipment.component';
import { CharacterItemsComponent } from './character/character-items/character-items.component';

interface VirtueDisadvBase {
  diceNum1: number;
  name1: string;
  diceNum2: number;
  name2: string;
}

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
  ],
  templateUrl: './system.component.html',
  styleUrl: './system.component.scss',
})
export class SystemComponent {
  background: string = 'table.jpg';
  activeSegmentName: 'character' | 'adventure' | 'actions' = 'character';
  activePageIndex: number = 0;
  maxPageIndex: number = 3;

  ngOnInit(): void {
    setBackground(this.background);
    this.setActiveSegment('character');
  }

  setActiveSegment(segment: 'character' | 'adventure' | 'actions'): void {
    document
      .getElementById(this.activeSegmentName)
      ?.classList.remove('selectedMarker');
    this.activeSegmentName = segment;
    document.getElementById(segment)?.classList.add('selectedMarker');
    this.activePageIndex = 0;
    switch (segment) {
      case 'character': {
        this.activePageIndex = 0;
        break;
      }
      case 'adventure': {
        /* this.activePageIndex = 3; */
        break;
      }
      case 'actions': {
        /* this.activePageIndex = 4; */
        break;
      }
    }
  }

  prev(): void {
    if (this.activePageIndex > 0) this.activePageIndex--;
  }

  next(): void {
    if (this.activePageIndex < 4) this.activePageIndex++;
  }
}
