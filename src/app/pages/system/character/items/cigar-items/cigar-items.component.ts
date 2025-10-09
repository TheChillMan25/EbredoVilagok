import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

interface Cigar {
  color: string;
  spice: string;
  effect: string;
}

@Component({
  selector: 'app-cigar-items',
  imports: [MatTableModule],
  templateUrl: './cigar-items.component.html',
  styleUrls: ['./cigar-items.component.scss', '../../../system_shared.scss'],
})
export class CigarItemsComponent {
  cigarData: Cigar[] = [
    {
      color: 'Piros',
      spice: 'Paprika és bors',
      effect: '+1 erő 10 percig',
    },
    {
      color: 'Zöld',
      spice: 'Alma és menta',
      effect: '+1 ügyesség 10 percig',
    },
    {
      color: 'Szürke',
      spice: 'Dió és fahéj',
      effect: '+1 kitartás 10 percig',
    },
    {
      color: 'Lila',
      spice: 'Leander és rózsa',
      effect: '+1 ész 10 percig',
    },
    {
      color: 'Sárga',
      spice: 'Citrus és vadvirágok',
      effect: '+1 fortély 10 percig',
    },
    {
      color: 'Kék',
      spice: 'Búzavirág és kamilla',
      effect: '+1 akaraterő 10 percig',
    },
  ];
  cigarSourceData = new MatTableDataSource<Cigar>(this.cigarData);
  displayedColumns = ['color', 'spice', 'effect'];
}
