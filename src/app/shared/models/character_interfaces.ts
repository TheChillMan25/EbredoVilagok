export interface VirtueDisadvBase {
  diceNum: number;
  name: string;
}

export interface CombinedVirtueDisadvRow {
  left?: VirtueDisadvBase;
  right?: VirtueDisadvBase;
}

export interface Weapon extends Item {
  dice: string;
  price: number;
  handed: 0 | 1 | 2;
}

export interface Armour extends Item {
  defValue: number;
  dexMod: number;
  price: number;
}

export interface Item {
  id: number;
  name: string;
  desc?: string;
  type: ItemType;
  category: ItemCategory;
  uses?: number;
}

export enum ItemType {
  COMMON,
  FOOD,
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
