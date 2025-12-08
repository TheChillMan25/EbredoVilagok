import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { foodRations, medicalItems } from '../../../../../shared/models/items';

@Component({
  selector: 'app-mandatory-items',
  imports: [MatTableModule],
  templateUrl: './mandatory-items.component.html',
  styleUrls: [
    './mandatory-items.component.scss',
    '../../../system_shared.scss',
  ],
})
export class MandatoryItemsComponent {
  foodRations = foodRations;
  medicalItems = medicalItems;
  foodRationDataSource = new MatTableDataSource<any>(foodRations);
  displayedColumns = ['silany', 'szereny', 'elegseges', 'boseges'];
}
