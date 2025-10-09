import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NationData } from '../NationData';

interface Nation {
  diceNum: number;
  name: string;
}

interface CombinedNationROw {
  left?: Nation;
  right?: Nation;
}

@Component({
  selector: 'app-character-species',
  imports: [MatTableModule],
  templateUrl: './character-species.component.html',
  styleUrls: ['./character-species.component.scss','./../../system_shared.scss']
})
export class CharacterSpeciesComponent {
  nationData: any = NationData;
  nationDataSource = new MatTableDataSource<CombinedNationROw>(this.nationData);
  displayedColumns: string[] = [
    'diceNum1',
    'nationName1',
    'diceNum2',
    'nationName2',
  ];

  combinedData: CombinedNationROw[] = [];

  constructor() {
    this.prepareCombinedData();
    this.nationDataSource = new MatTableDataSource<CombinedNationROw>(
      this.combinedData
    );
  }

  prepareCombinedData() {
    for (let i = 0; i < this.nationData.length / 2; i++) {
      this.combinedData.push({
        left: this.nationData[i] as Nation,
        right: this.nationData[i + 9] as Nation,
      });
    }
  }
}
