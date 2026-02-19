import { Component, Input } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Armour, Weapon } from '../../../../shared/models/game_interfaces';
import { ItemService } from '../../../../shared/services/item/item.service';

@Component({
  selector: 'app-character-equipment',
  imports: [MatTableModule],
  templateUrl: './character-equipment.component.html',
  styleUrls: [
    './character-equipment.component.scss',
    '../../system_shared.scss',
  ],
})
export class CharacterEquipmentComponent {
  weaponsDataSource = new MatTableDataSource<Weapon>();
  armourDataSource = new MatTableDataSource<Armour>();
  displayedWeaponColumns: string[] = ['name', 'dice', 'price'];
  displayedArmourColumns: string[] = ['name', 'defValue', 'dexMod', 'price'];

  @Input() set weapons(value: Weapon[] | undefined) {
    if (value && value.length > 0) {
      this.weaponsDataSource.data = value;
    }
  }

  @Input() set armours(value: Armour[] | undefined) {
    if (value && value.length > 0) {
      this.armourDataSource.data = value;
    }
  }
}
