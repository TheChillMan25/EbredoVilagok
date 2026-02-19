export interface VirtueDisadvBase {
  diceNum: number;
  name: string;
}

export interface CombinedVirtueDisadvRow {
  left?: VirtueDisadvBase;
  right?: VirtueDisadvBase;
}

export enum ItemSize {
  SMALL = 'SMALL',
  NORMAL = 'NORMAL',
  LARGE = 'LARGE',
}

export enum ItemType {
  COMMON = 'COMMON',
  FOOD = 'FOOD',
  MEDICAL = 'MEDICAL',
  CIGAR = 'CIGAR',
  SPECIAL = 'SPECIAL',
  WEAPON = 'WEAPON',
  ARMOUR = 'ARMOUR',
  AMMO = 'AMMO',
  SPICE = 'SPICE',
  BAG = 'BAG',
}

export enum ItemCategory {
  EQIUPMENT = 'EQIUPMENT',
  CONSUMABLE = 'CONSUMABLE',
  GENERAL = 'GENERAL',
  INVENTORY = 'INVENTORY',
}

export interface Item {
  id?: number;
  name: string;
  desc?: string;
  size: ItemSize;
  type: ItemType;
  category: ItemCategory;
  uses?: number;
  effects?: ItemEffect[];
  price?: number;
}

export interface Inventory extends Item {
  canStore: ItemType[];
  storage: { id: string; amount: number }[];
  space: number;
}

export interface SpecialItem extends Item {
  effectDesc?: string;
  isPartyWide?: boolean;
  combat?: boolean;
}

export interface Food extends Item {
  heal?: number;
}

export interface Weapon extends Item {
  diceCount: number;
  damage: string;
  weaponType: 'melee' | 'ranged';
  price: number;
  handed: 0 | 1 | 2;
  reload?: boolean;
}

export interface Armour extends Item {
  defValue: number;
  dexMod: number;
  price: number;
}

export interface Cigar extends Item {
  color?: string;
  spice?: string;
  effectDesc?: string;
}

export enum StatusType {
  BLEED = 'BLEED',
  POISON = 'POISON',
  BURN = 'BURN',
  LOST_LIMB = 'LOST_LIMB',
  PROSTHETIC = 'PROSTHETIC',
  FIRE_RES = 'FIRE_RES',
  POISON_RES = 'POISON_RES',
  ADVANTAGE = 'ADVANTAGE',
  DISADVANTAGE = 'DISADVANTAGE',
  ANIMAL_TOUNGE = 'ANIMAL_TOUNGE',
  FREE_MAGIC = 'FREE_MAGIC',
  SLEEP = 'SLEEP',
  STRESS_RES = 'STRESS_RES',
  FULL_BELLY = 'FULL_BELLY',
  DEAD = 'DEAD',
  INSANE = 'INSANE',
}

export interface ActiveStatus {
  type: StatusType;
  duration: number;
  value?: number;
}

export enum EffectType {
  HEAL_HP = 'HEAL_HP',
  HEAL_SP = 'HEAL_SP',
  HEAL_SMALL_WOUND = 'HEAL_SMALL_WOUND',
  HEAL_LARGE_WOUND = 'HEAL_LARGE_WOUND',
  BUFF_STAT = 'BUFF_STAT',
  REMOVE_STATUS = 'REMOVE_STATUS',
  ADD_STATUS = 'ADD_STATUS',
}

export interface ItemEffect {
  type: EffectType;
  value?: number;
  stat?: string;
  status?: StatusType;
  duration?: number;
  target?: 'self' | 'target' | 'party';
}

export enum GameErrorCauses {
  NoPrimaryAction,
  NoSecondaryAction,
  HPAlreadyFull,
  SPAlreadyFull,
  NoSmallWounds,
  NoLargeWounds,
  NoStatToBuff,
  NoStatusToAdd,
  NoStatusToRemove,
  NPCInCombat,
  NoPermission,
  NPCNotFound,
  GameUpdateError,
  AlreadyInGame,
}

export enum CharacterCreationErrorCauses {
  InvalidFormData
}