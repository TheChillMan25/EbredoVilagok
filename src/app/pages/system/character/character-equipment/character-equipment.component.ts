import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Armour, Weapon } from '../../../../shared/models/character_interfaces';
import { armours, weapons } from '../../../../shared/models/equipment';

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
  weaponsDataSource = new MatTableDataSource<Weapon>(weapons);
  armourDataSource = new MatTableDataSource<Armour>(armours);
  displayedWeaponColumns: string[] = ['name', 'dice', 'price'];
  displayedArmourColumns: string[] = ['name', 'defValue', 'dexMod', 'price'];
}
