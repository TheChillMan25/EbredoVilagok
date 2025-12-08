export interface VirtueDisadvBase {
  diceNum: number;
  name: string;
}

export interface CombinedVirtueDisadvRow {
  left?: VirtueDisadvBase;
  right?: VirtueDisadvBase;
}

export interface Weapon {
  name: string;
  dice: string;
  price: number;
}

export interface Armour {
  name: string;
  defValue: number;
  dexMod: number;
  price: number;
}

export interface Item {
  name: string;
  desc: string;
}
