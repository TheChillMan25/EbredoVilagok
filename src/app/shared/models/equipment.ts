import { Armour, Weapon } from './character_interfaces';

export const weapons: Weapon[] = [
  { name: 'Tőr', dice: '1d4', price: 10, handed: 1 },
  { name: 'Pálca', dice: '1d4', price: 12, handed: 1 },
  { name: 'Ostor', dice: '1d4', price: 15, handed: 1 },
  { name: 'Kard', dice: '1d6', price: 20, handed: 1 },
  { name: 'Hosszúkard', dice: '1d6', price: 30, handed: 1 },
  { name: 'Rapír', dice: '1d6', price: 25, handed: 1 },
  { name: 'Szablya', dice: '1d6', price: 22, handed: 1 },
  { name: 'Fejsze', dice: '1d6', price: 18, handed: 1 },
  { name: 'Csatabárd', dice: '1d8', price: 35, handed: 2 },
  { name: 'Buzogány', dice: '1d6', price: 20, handed: 1 },
  { name: 'Lándzsa', dice: '1d6', price: 24, handed: 2 },
  { name: 'Acél öklök', dice: '2d4', price: 28, handed: 2 },
  { name: 'Kalapács', dice: '1d6', price: 20, handed: 2 },
  { name: 'Pöröly', dice: '1d8', price: 32, handed: 1 },
  { name: 'Fokos', dice: '1d6', price: 26, handed: 1 },
  { name: 'Íj', dice: '1d10', price: 40, handed: 2 },
  { name: 'Számszeríj', dice: '1d10', price: 50, handed: 2 },
  { name: 'Pisztoly', dice: '1d12', price: 60, handed: 1 },
  { name: 'Karabély', dice: '1d12', price: 75, handed: 2 },
  { name: 'Kézi ágyú', dice: '3d6', price: 100, handed: 2 },
  { name: 'Kézi balliszta', dice: '1d20', price: 120, handed: 2 },
  { name: 'Üres', dice: 'nincs', price: 0, handed: 0 },
];

export const armours: Armour[] = [
  { name: 'Ruha', defValue: 1, dexMod: 0, price: 15 },
  { name: 'Könnyű páncél', defValue: 2, dexMod: 0, price: 25 },
  { name: 'Nehéz páncél', defValue: 3, dexMod: -1, price: 35 },
  { name: 'Sétáló erőd', defValue: 5, dexMod: -2, price: 55 },
];

export function getWeapon(idx: number) {
  return weapons[idx];
}

export function getArmour(idx: number) {
  return armours[idx];
}
