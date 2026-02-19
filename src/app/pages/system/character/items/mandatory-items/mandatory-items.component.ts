import { Component, Input } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ItemService } from '../../../../../shared/services/item/item.service';
import {
  Food,
  SpecialItem,
} from '../../../../../shared/models/game_interfaces';

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
  foodRations: Food[] = [];
  medicalItems: SpecialItem[] = [];
  foodRationDataSource?: MatTableDataSource<Food>;
  displayedColumns = ['silany', 'szereny', 'elegseges', 'boseges'];
  @Input() set foodItems(value: Food[] | undefined) {
    if (value && value.length > 0) {
      this.foodRations = value;
      this.foodRationDataSource = new MatTableDataSource<Food>(
        this.foodRations
      );
    }
  }
  @Input() set healItems(value: SpecialItem[] | undefined) {
    if (value && value.length > 0) {
      this.medicalItems = value;
    }
  }
}
