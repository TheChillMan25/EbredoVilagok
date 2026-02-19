import { Component, Input } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Item } from '../../../../../shared/models/game_interfaces';
import { ItemService } from '../../../../../shared/services/item/item.service';

@Component({
  selector: 'app-character-items',
  imports: [MatTableModule],
  templateUrl: './character-items.component.html',
  styleUrls: [
    './character-items.component.scss',
    '../../../system_shared.scss',
  ],
})
export class CharacterItemsComponent {
  itemDataSource = new MatTableDataSource<Item>();
  displayedColumns: string[] = ['name', 'desc'];

  @Input() set items(value: Item[] | undefined) {
    if (value && value.length > 0) {
      this.itemDataSource.data = value;
    }
  }
}
