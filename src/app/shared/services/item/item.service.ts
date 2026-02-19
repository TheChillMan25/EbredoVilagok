import { Injectable } from '@angular/core';
import {
  Armour,
  Cigar,
  Food,
  Inventory,
  Item,
  ItemType,
  SpecialItem,
  Weapon,
} from '../../models/game_interfaces';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import {
  armours,
  cigars,
  foodRations,
  inventories,
  items,
  medicalItems,
  specialDrinks,
  weapons,
} from '../../models/items';

interface LocalCache {
  version: number;
  data: any[];
}

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private itemsMap: Record<
    string,
    Food[] | Item[] | SpecialItem[] | Weapon[] | Armour[] | Inventory[]
  > = {
    food: [] as Food[],
    general: [] as Item[],
    heal: [] as SpecialItem[],
    specDrinks: [] as SpecialItem[],
    allSpecial: [] as SpecialItem[],
    cigars: [] as Cigar[],
    weapons: [] as Weapon[],
    armours: [] as Armour[],
    inventory: [] as Inventory[],
    allGeneral: [] as (Item | Inventory)[],
  };
  constructor(private firestore: Firestore) {}

  async uploadItems() {
    try {
      const batch = writeBatch(this.firestore);
      const itemsRef = collection(this.firestore, 'Items');
      const metadataDoc = doc(this.firestore, 'Metadata', 'items');
      let index = 0;
      foodRations.forEach((item, originalIndex) => {
        const itemDoc = doc(itemsRef, index.toString());
        batch.set(itemDoc, {
          ...item,
          id: index,
          originalIndex: originalIndex,
        });
        index++;
      });
      medicalItems.forEach((item, originalIndex) => {
        const itemDoc = doc(itemsRef, index.toString());
        batch.set(itemDoc, {
          ...item,
          id: index,
          originalIndex: originalIndex,
        });
        index++;
      });
      specialDrinks.forEach((item, originalIndex) => {
        const itemDoc = doc(itemsRef, index.toString());
        batch.set(itemDoc, {
          ...item,
          id: index,
          originalIndex: originalIndex,
        });
        index++;
      });
      inventories.forEach((item, originalIndex) => {
        const itemDoc = doc(itemsRef, index.toString());
        batch.set(itemDoc, {
          ...item,
          id: index,
          originalIndex: originalIndex,
        });
        index++;
      });
      weapons.forEach((item, originalIndex) => {
        const itemDoc = doc(itemsRef, index.toString());
        batch.set(itemDoc, {
          ...item,
          id: index,
          originalIndex: originalIndex,
        });
        index++;
      });
      armours.forEach((item, originalIndex) => {
        const itemDoc = doc(itemsRef, index.toString());
        batch.set(itemDoc, {
          ...item,
          id: index,
          originalIndex: originalIndex,
        });
        index++;
      });
      cigars.forEach((item, originalIndex) => {
        const itemDoc = doc(itemsRef, index.toString());
        batch.set(itemDoc, {
          ...item,
          id: index,
          originalIndex: originalIndex,
        });
        index++;
      });
      items.forEach((item, originalIndex) => {
        const itemDoc = doc(itemsRef, index.toString());
        batch.set(itemDoc, {
          ...item,
          id: index,
          originalIndex: originalIndex,
        });
        index++;
      });
      batch.set(metadataDoc, { version: 1 });
      await batch.commit();
      console.log('Tárgyak feltöltve az adatbázisba.');
    } catch (error) {
      console.error('Hiba a tárgyak feltöltésekor: ', error);
      throw error;
    }
  }

  async initItems() {
    try {
      console.log('Tárgyak betöltése...');
      const metaref = doc(this.firestore, 'Metadata', 'items');
      const metaDoc = await getDoc(metaref);
      const serverVersion = metaDoc.exists() ? metaDoc.data()['version'] : 0;

      const cachedItems = localStorage.getItem('CachedItems');
      let localData: LocalCache | null = null;
      if (cachedItems) {
        localData = JSON.parse(cachedItems);
      }

      if (localData && localData.version === serverVersion) {
        this.processItems(localData.data);
      } else {
        const querySnapshot = await getDocs(
          collection(this.firestore, 'Items')
        );
        const allItems = querySnapshot.docs.map((doc) => doc.data());

        const newCache: LocalCache = {
          version: serverVersion,
          data: allItems,
        };
        localStorage.setItem('CachedItems', JSON.stringify(newCache));
        this.processItems(allItems);
      }
    } catch (error) {
      console.error('Hiba a tárgyak feltöltéseko: ', error);
      throw error;
    }
  }

  processItems(allItems: any[]) {
    Object.values(this.itemsMap).forEach((arr) => (arr.length = 0));
    allItems.forEach((item) => {
      switch (item.type) {
        case ItemType.FOOD:
          this.itemsMap['food'][item.originalIndex] = item as Food;
          break;
        case ItemType.MEDICAL:
          this.itemsMap['heal'][item.originalIndex] = item as SpecialItem;
          break;
        case ItemType.SPECIAL:
          this.itemsMap['specDrinks'][item.originalIndex] = item as SpecialItem;
          break;
        case ItemType.WEAPON:
          this.itemsMap['weapons'][item.originalIndex] = item as Weapon;
          break;
        case ItemType.ARMOUR:
          this.itemsMap['armours'][item.originalIndex] = item as Armour;
          break;
        case ItemType.COMMON:
          this.itemsMap['general'][item.originalIndex] = item as Item;
          break;
        case ItemType.BAG:
          this.itemsMap['inventory'][item.originalIndex] = item as Inventory;
          break;
        case ItemType.CIGAR:
          this.itemsMap['cigars'][item.originalIndex] = item as Cigar;
          break;
        default:
          console.warn(
            `Nem található kategórai "${item.name}" tárgyhoz: ${item.type}`
          );
      }
      this.itemsMap['allSpecial'] = [
        ...this.itemsMap['heal'],
        ...this.itemsMap['specDrinks'],
      ];
      this.itemsMap['allGeneral'] = [
        ...this.itemsMap['general'],
        ...this.itemsMap['inventory'],
      ];
    });
    console.log('Tárgyak betöltése sikeres!', this.itemsMap);
  }
  getItemById(
    group:
      | 'food'
      | 'heal'
      | 'specDrinks'
      | 'weapons'
      | 'armours'
      | 'general'
      | 'inventory'
      | 'cigars'
      | 'allSpecial'
      | 'allGeneral',
    id: number
  ): Item | Food | SpecialItem | Weapon | Armour | Cigar | Inventory {
    const item = this.itemsMap[group].find((i) => i.id === id);
    return item!;
  }
  getItemByIndex(
    group:
      | 'food'
      | 'heal'
      | 'specDrinks'
      | 'weapons'
      | 'armours'
      | 'general'
      | 'inventory'
      | 'cigars'
      | 'allSpecial'
      | 'allGeneral',
    idx: number
  ): Item | Food | SpecialItem | Weapon | Armour | Cigar | Inventory {
    return this.itemsMap[group][idx];
  }
  getItemGroup(
    groupName: string
  ):
    | Item[]
    | Food[]
    | SpecialItem[]
    | Weapon[]
    | Armour[]
    | Cigar[]
    | Inventory[] {
    if (this.itemsMap[groupName]) {
      return this.itemsMap[groupName];
    }
    return [];
  }
  getAllItems() {
    let items = [
      ...this.itemsMap['food'],
      ...this.itemsMap['heal'],
      ...this.itemsMap['specDrinks'],
      ...this.itemsMap['cigars'],
      ...this.itemsMap['general'],
      ...this.itemsMap['inventory'],
      ...this.itemsMap['weapons'],
      ...this.itemsMap['armours'],
    ];
    return items;
  }
  generateNewItemID(id: number = 0) {
    const lastID =
      this.getAllItems().sort((a: Item, b: Item) => b.id! - a.id!)[0].id ?? 250;
    return lastID > id ? lastID + 1 : id + 1;
  }
}
