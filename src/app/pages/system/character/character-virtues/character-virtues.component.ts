import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CharacterVirtues } from '../../virtues_disadvantages';
import {
  VirtueDisadvBase,
  CombinedVirtueDisadvRow,
} from '../character_interfaces';

@Component({
  selector: 'app-character-virtues',
  imports: [MatTableModule],
  templateUrl: './character-virtues.component.html',
  styleUrls: [
    './character-virtues.component.scss',
    './../character_shared.scss',
  ],
})
export class CharacterVirtuesComponent {
  virtuesData: any = CharacterVirtues;
  virtuesDataSource = new MatTableDataSource<CombinedVirtueDisadvRow>(
    this.virtuesData
  );
  displayedColumns: string[] = ['diceNum1', 'name1', 'diceNum2', 'name2'];

  combinedData: CombinedVirtueDisadvRow[] = [];

  constructor() {
    this.prepareCombinedData();
    this.virtuesDataSource = new MatTableDataSource<CombinedVirtueDisadvRow>(
      this.combinedData
    );
  }

  prepareCombinedData() {
    for (let i = 0; i < this.virtuesData.length / 2; i++) {
      this.combinedData.push({
        left: this.virtuesData[i] as VirtueDisadvBase,
        right: this.virtuesData[i + 25] as VirtueDisadvBase,
      });
    }
  }
}
