import { Component, Input } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Cigar } from '../../../../../shared/models/game_interfaces';

@Component({
  selector: 'app-cigar-items',
  imports: [MatTableModule],
  templateUrl: './cigar-items.component.html',
  styleUrls: ['./cigar-items.component.scss', '../../../system_shared.scss'],
})
export class CigarItemsComponent {
  cigarSourceData = new MatTableDataSource<Cigar>();
  displayedColumns = ['color', 'spice', 'effect'];

  @Input() set cigars(value: Cigar[] | undefined) {
    console.log(value);
    if (value && value.length > 0) {
      this.cigarSourceData.data = value;
    }
  }
}
