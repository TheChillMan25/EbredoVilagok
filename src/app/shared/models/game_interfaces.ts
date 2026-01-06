export interface VirtueDisadvBase {
  diceNum: number;
  name: string;
}

export interface CombinedVirtueDisadvRow {
  left?: VirtueDisadvBase;
  right?: VirtueDisadvBase;
}

export interface Weapon extends Item {
  diceCount: number;
  damage: string;
  price: number;
  handed: 0 | 1 | 2;
}

export interface Armour extends Item {
  defValue: number;
  dexMod: number;
  price: number;
}

export interface Cigar extends Item {
  color: string;
  spice: string;
  effect: string;
}

export enum ItemSize {
  SMALL,
  NORMAL,
  LARGE,
}

export interface Item {
  id?: number;
  name: string;
  desc?: string;
  size: ItemSize;
  type: ItemType;
  category: ItemCategory;
  uses?: number;
}

export enum ItemType {
  COMMON,
  FOOD,
  MEDICAL,
  CIGAR,
  SPECIAL,
  WEAPON,
  ARMOUR,
  AMMO,
  SPICE,
  BAG,
}

export enum ItemCategory {
  EQIUPMENT,
  CONSUMABLE,
  GENERAL,
  INVENTORY,
}

export interface Inventory extends Item {
  canStore: ItemType[];
  storage: { id: string; amount: number }[];
  space: number;
}

export interface Food extends Item {
  heal: number;
}
export interface SpecialItem extends Item {
  effect: string;
  isPartyWide: boolean;
  combat: boolean;
}
