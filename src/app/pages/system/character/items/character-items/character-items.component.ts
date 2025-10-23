import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Item } from '../../../../../shared/models/character_interfaces';
import { items } from '../../../../../shared/models/items';

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
  items = items;
  itemDataSource = new MatTableDataSource<Item>(this.items);
  displayedColumns: string[] = ['name', 'desc'];
}
