import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Armour, Weapon } from '../character_interfaces';

@Component({
  selector: 'app-character-equipment',
  imports: [MatTableModule],
  templateUrl: './character-equipment.component.html',
  styleUrls: [
    './character-equipment.component.scss',
    '../character_shared.scss',
  ],
})
export class CharacterEquipmentComponent {
  weapons: Weapon[] = [
    { name: 'Tőr', dice: '1d4', price: 10 },
    { name: 'Pálca', dice: '1d4', price: 12 },
    { name: 'Ostor', dice: '1d4', price: 15 },
    { name: 'Kard', dice: '1d6', price: 20 },
    { name: 'Hosszúkard', dice: '1d6', price: 30 },
    { name: 'Rapír', dice: '1d6', price: 25 },
    { name: 'Szablya', dice: '1d6', price: 22 },
    { name: 'Fejsze', dice: '1d6', price: 18 },
    { name: 'Csatabárd', dice: '1d8', price: 35 },
    { name: 'Buzogány', dice: '1d6', price: 20 },
    { name: 'Lándzsa', dice: '1d6', price: 24 },
    { name: 'Acél öklök', dice: '2d4', price: 28 },
    { name: 'Kalapács', dice: '1d6', price: 20 },
    { name: 'Pöröly', dice: '1d8', price: 32 },
    { name: 'Fokos', dice: '1d6', price: 26 },
    { name: 'Íj', dice: '1d10', price: 40 },
    { name: 'Számszeríj', dice: '1d10', price: 50 },
    { name: 'Pisztoly', dice: '1d12', price: 60 },
    { name: 'Karabély', dice: '1d12', price: 75 },
    { name: 'Kézi ágyú', dice: '3d6', price: 100 },
    { name: 'Kézi balliszta', dice: '1d20', price: 120 },
  ];

  armours: Armour[] = [
    { name: 'Ruha', defValue: 1, dexMod: 0, price: 15 },
    { name: 'Könnyű páncél', defValue: 2, dexMod: 0, price: 25 },
    { name: 'Nehéz páncél', defValue: 3, dexMod: -1, price: 35 },
    { name: 'Sétáló erőd', defValue: 5, dexMod: -2, price: 55 },
  ];

  weaponsDataSource = new MatTableDataSource<Weapon>(this.weapons);
  armourDataSource = new MatTableDataSource<Armour>(this.armours);
  displayedWeaponColumns: string[] = ['name', 'dice', 'price'];
  displayedArmourColumns: string[] = ['name', 'defValue', 'dexMod', 'price'];
}
