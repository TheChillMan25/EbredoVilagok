import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CharacterDisadvantages } from '../../virtues_disadvantages';
import {
  CombinedVirtueDisadvRow,
  VirtueDisadvBase,
} from '../character_interfaces';

@Component({
  selector: 'app-character-disadvantages',
  imports: [MatTableModule],
  templateUrl: './character-disadvantages.component.html',
  styleUrls: [
    './character-disadvantages.component.scss',
    './../character_shared.scss',
  ],
})
export class CharacterDisadvantagesComponent {
  diadvantagesData: any = CharacterDisadvantages;
  diadvantagesDataSource = new MatTableDataSource<CombinedVirtueDisadvRow>(
    this.diadvantagesData
  );
  displayedColumns: string[] = ['diceNum1', 'name1', 'diceNum2', 'name2'];

  combinedData: CombinedVirtueDisadvRow[] = [];

  constructor() {
    this.prepareCombinedData();
    this.diadvantagesDataSource =
      new MatTableDataSource<CombinedVirtueDisadvRow>(this.combinedData);
  }

  prepareCombinedData() {
    for (let i = 0; i < this.diadvantagesData.length / 2; i++) {
      this.combinedData.push({
        left: this.diadvantagesData[i] as VirtueDisadvBase,
        right: this.diadvantagesData[i + 25] as VirtueDisadvBase,
      });
    }
  }
}
