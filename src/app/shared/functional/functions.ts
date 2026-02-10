import { species as Species } from '../../pages/world/species/species_desc_data';
import { Character } from '../models/models';
import { NationData } from '../models/NationData';
import { classes } from '../models/classes';
import {
  CharacterVirtues,
  CharacterDisadvantages,
} from '../models/virtues_disadvantages';
import { ItemService } from '../services/item/item.service';
import {
  Armour,
  Cigar,
  EffectType,
  Food,
  Inventory,
  Item,
  ItemSize,
  SpecialItem,
  StatusType,
  Weapon,
} from '../models/game_interfaces';
import { items } from '../models/items';
import { FormGroup } from '@angular/forms';

let virtues = CharacterVirtues.map((virtue) => virtue.name);
let disadvantages = CharacterDisadvantages.map((disadv) => disadv.name);

export function setBackground(path: string, color: boolean = false) {
  const pageElement = document.getElementById('page');
  if (pageElement && !color) {
    pageElement.style.background = `url(/assets/img/backgrounds/${path}.webp)`;
  } else if (pageElement && color) {
    pageElement.style.background = path;
  }
}

type SpeciesId =
  | 'folyokoz'
  | 'toronyvarosok'
  | 'kelet_nepe'
  | 'novenyszerzetek'
  | 'gepszulottek'
  | 'atkozottak';

const SPECIES_NAME_MAP: Record<SpeciesId, string> = {
  folyokoz: 'Folyóköz',
  toronyvarosok: 'Toronyvárosok',
  kelet_nepe: 'Kelet Népe',
  novenyszerzetek: 'Növényszerzetek',
  gepszulottek: 'Gépszülöttek',
  atkozottak: 'Átkozottak',
};

export function getSpeciesName(id: string | null): string {
  if (id === null) throw new Error('Unable to get species name with NULL id');

  if (isValidSpeciesId(id)) {
    return SPECIES_NAME_MAP[id];
  } else {
    throw new Error('Unable to get species name with id: ' + id);
  }
}

function isValidSpeciesId(id: string): id is SpeciesId {
  return id in SPECIES_NAME_MAP;
}

export function setDisplay(element: HTMLElement, display: string) {
  element.style.display = display;
}

export function convertSpeciesNameToKey(
  name: string | undefined
): { landID: string; speciesID: number } | undefined | null {
  if (name) {
    if (['Folyóköz', 'Magasföld', 'Holtág'].includes(name)) {
      return {
        landID: 'folyokoz',
        speciesID: ['Folyóköz', 'Magasföld', 'Holtág'].indexOf(name),
      };
    } else if (['Den Karadenn', 'Cha’Me’Rén', 'Doma Altiora'].includes(name)) {
      return {
        landID: 'toronyvarosok',
        speciesID: ['Den Karadenn', 'Cha’Me’Rén', 'Doma Altiora'].indexOf(name),
      };
    } else if (['Édd', 'Vadin', 'Monor'].includes(name)) {
      return {
        landID: 'kelet_nepe',
        speciesID: ['Édd', 'Vadin', 'Monor'].indexOf(name),
      };
    } else if (['Rügysze', 'Kérgeláb', 'Kalapos'].includes(name)) {
      return {
        landID: 'novenyszerzetek',
        speciesID: ['Rügysze', 'Kérgeláb', 'Kalapos'].indexOf(name),
      };
    } else if (
      ['Au-1. Fenntartó', 'Au-2. Utód', 'Au-Cust. Örző'].includes(name)
    ) {
      return {
        landID: 'gepszulottek',
        speciesID: ['Au-1. Fenntartó', 'Au-2. Utód', 'Au-Cust. Örző'].indexOf(
          name
        ),
      };
    } else
      return {
        landID: 'atkozottak',
        speciesID: ['Abominus', 'Vámpír'].indexOf(name),
      };
  }
  return null;
}

export function getHome(
  species: string | undefined,
  index: number | undefined
): { desc: string; bonus: { name: string; mod: string }[] } {
  let speciesObj = convertSpeciesNameToKey(species);
  if (speciesObj && index !== undefined) {
    return Species[speciesObj?.landID][speciesObj?.speciesID].homes[index];
  } else return { desc: '', bonus: [] };
}

export function getSpeciesSpecial(
  species: string | undefined,
  index: number | undefined
): { desc: string } {
  let speciesObj = convertSpeciesNameToKey(species);
  if (speciesObj && index !== undefined)
    return Species[speciesObj?.landID][speciesObj?.speciesID].speciesSpecial[
      index
    ];
  else return { desc: '' };
}

export function createStats() {
  let stats: number[] = [];

  for (let index = 0; index < 8; index++) {
    let randomStat1 = Math.ceil(Math.random() * 10);
    let randomStat2 = Math.ceil(Math.random() * 10);
    stats.push(randomStat1 + randomStat2);
  }

  stats.sort((a, b) => a - b);
  stats.shift();
  stats.shift();

  return convertNumbersToStats(stats);
}

export function convertNumbersToStats(numbers: number[]) {
  let stats: number[] = [];
  for (let index = 0; index < numbers.length; index++) {
    if (numbers[index] < 1)
      throw new Error('Negatív szám vagy 0 stat konvertáláskor');
    let randomStat = numbers[index];
    if (randomStat < 4) {
      stats.push(-3);
    } else if (randomStat >= 5 && randomStat <= 6) {
      stats.push(-2);
    } else if (randomStat >= 7 && randomStat <= 8) {
      stats.push(-1);
    } else if (randomStat >= 9 && randomStat <= 12) {
      stats.push(0);
    } else if (randomStat >= 13 && randomStat <= 14) {
      stats.push(1);
    } else if (randomStat >= 15 && randomStat <= 16) {
      stats.push(2);
    } else {
      stats.push(3);
    }
  }
  return stats;
}

export function getStat(stats: number[]) {
  let randIndex = Math.max(0, Math.floor(Math.random() * stats.length));
  let stat = stats[randIndex];
  stats.splice(randIndex, 1);
  return stat;
}

function createRandomEquipment(itemService: ItemService) {
  while (true) {
    const left = itemService.getItemByIndex(
      'weapons',
      Math.floor(Math.random() * itemService.getItemGroup('weapons').length)) as Weapon;
    const right = itemService.getItemByIndex(
      'weapons',
      Math.floor(Math.random() * itemService.getItemGroup('weapons').length)) as Weapon;
    const armour = itemService.getItemByIndex(
      'armours',
      Math.floor(Math.random() * itemService.getItemGroup('armours').length)) as Armour
    if (checkEquipment(left, right)) {
      return {
        left: { ...left },
        right: { ...right },
        armour: { ...armour }
      };
    }
  }
}

function checkEquipment(left: Weapon, right: Weapon) {
  return !(
    (left.handed === 2 && right.handed !== 0) ||
    (left.handed !== 0 && right.handed === 2)
  );
}

function createItems(
  group: 'food' | 'allSpecial' | 'allGeneral',
  itemService: ItemService
) {
  let iterations = group === 'food' ? 1 : group === 'allSpecial' ? 3 : 5;
  let items: (Item | Food | SpecialItem | Inventory | Cigar)[] = [];
  const l = itemService.getItemGroup(group).length;
  if (!l) return [];
  let successfulAdds = 0;
  let safetyCounter = 0;
  while (successfulAdds < iterations && safetyCounter < 100) {
    safetyCounter++;
    const originalItem = itemService.getItemByIndex(
      group,
      Math.floor(Math.random() * l)
    );
    if (originalItem) {
      const existingItemIndex = items.findIndex(
        (i) => i.id === originalItem.id
      );
      if (existingItemIndex > -1) {
        let existingItem = items[existingItemIndex];
        if ('uses' in existingItem && 'uses' in originalItem) {
          existingItem.uses =
            (existingItem.uses || 0) + (originalItem.uses || 0);
          successfulAdds++;
        }
      } else {
        const newItem = { ...originalItem };
        items.push(newItem);
        successfulAdds++;
      }
    }
  }
  return items;
}

export function createRandomCharacter(
  charName: string,
  itemService: ItemService
): Omit<Character, 'id' | 'userId'> {
  if (typeof charName !== 'string')
    throw new Error('Nem megfelelő névérték: ' + charName);
  let stats = createStats();
  const hp = Math.ceil(Math.random() * 6),
    sp =
      Math.ceil(Math.random() * 4) +
      Math.ceil(Math.random() * 4) +
      Math.ceil(Math.random() * 4);
  let food = createItems('food', itemService) as Food[];
  let specItems = createItems('allSpecial', itemService) as SpecialItem[];
  let genItems = createItems('allGeneral', itemService) as (Item | Inventory)[];
  let randomCharacter: Omit<Character, 'id' | 'userId'> = {
    currentAdventure: '',
    name: charName || '',
    species: NationData.map((nation) => nation.nationName)[
      Math.floor(Math.random() * 17)
    ],
    class: classes[Math.floor(Math.random() * (classes.length - 1))],
    level: 1,
    specialProperties: {
      speciesProperty: Math.floor(Math.random() * 6),
      home: Math.floor(Math.random() * 6),
    },
    stats: {
      physical: {
        str: getStat(stats),
        dex: getStat(stats),
        end: getStat(stats),
      },
      mental: {
        int: getStat(stats),
        cun: getStat(stats),
        wil: getStat(stats),
      },
      main: {
        hp: hp,
        maxHP: hp,
        sp: sp,
        maxSP: sp,
      },
    },
    equipment: createRandomEquipment(itemService),
    virtues: {
      virtues: [
        Math.floor(Math.random() * virtues.length),
        Math.floor(Math.random() * virtues.length),
      ],
      disadv: [Math.floor(Math.random() * disadvantages.length)],
    },
    coins: 200,
    items: {
      food: food,
      specialItems: specItems,
      generalItems: genItems,
      equipmentItems: [],
    },
    wounds: {
      small: 0,
      large: 0,
    },
    activeStatuses: [],
  };
  return randomCharacter;
}

export function createCharacter(
  form: FormGroup, itemService: ItemService, id: string | null = null, userId: string | null = null
): Character {
  if (form.invalid) {
    throw new Error('Karakter nem készíthető el, tölts ki minden kötelező mezőt!');
  }
  const formValue = form.value;

  let food: Food[] = [];
  if (formValue.items?.food) {
    formValue.items.food.forEach((c: number | null) => {
      if (c) {
        const item = itemService.getItemById('food', c) as Food
        food.push({ ...item });
      }
    });
  }
  let special: SpecialItem[] = [];
  if (formValue.items?.specialItems) {
    formValue.items.specialItems.forEach((c: number | null) => {
      if (c) {
        const item = itemService.getItemById('allSpecial', c) as SpecialItem
        special.push({ ...item });
      }
    });
  }
  let general: (Item | Inventory)[] = [];
  if (formValue.items?.generalItems) {
    formValue.items.generalItems.forEach((c: number | null) => {
      if (c) {
        const item = itemService.getItemById('allGeneral', c) as Item | Inventory
        general.push({ ...item });
      }
    });
  }

  let newCharacter: Character = {
    id: id ?? '',
    userId: userId ?? '',
    currentAdventure: '',
    name: formValue.name || '',
    species: formValue.species || '',
    class: formValue.class || '',
    level: 1,
    specialProperties: {
      speciesProperty: formValue.specialProperties.speciesProperty ?? 0,
      home: formValue.specialProperties.home ?? 0,
    },
    stats: {
      physical: {
        str: formValue.stats.physical.str ?? 1,
        dex: formValue.stats.physical.dex ?? 1,
        end: formValue.stats.physical.end ?? 1,
      },
      mental: {
        int: formValue.stats.mental.int ?? 1,
        cun: formValue.stats.mental.cun ?? 1,
        wil: formValue.stats.mental.wil ?? 1,
      },
      main: {
        hp: formValue.stats.main.hp ?? 1,
        maxHP: formValue.stats.main.hp ?? 1,
        sp: formValue.stats.main.sp ?? 1,
        maxSP: formValue.stats.main.sp ?? 1,
      },
    },
    equipment: {
      left:
        (itemService.getItemById(
          'weapons',
          formValue.equipment.left
        ) as Weapon) ?? { ...itemService.getItemGroup('weapons')[21] },
      right:
        (itemService.getItemById(
          'weapons',
          formValue.equipment.right
        ) as Weapon) ?? { ...itemService.getItemGroup('weapons')[21] },
      armour:
        (itemService.getItemById(
          'armours',
          formValue.equipment.armour
        ) as Armour) ?? { ...itemService.getItemGroup('armours')[0] },
    },
    virtues: {
      virtues: formValue.virtues?.virtues ?? [],
      disadv: formValue.virtues?.disadvantage ?? [],
    },
    coins: 200,
    items: {
      food: food ?? [],
      specialItems: special ?? [],
      generalItems: general ?? [],
      equipmentItems: [],
    },
    wounds: {
      small: 0,
      large: 0,
    },
    activeStatuses: [],
  };
  return newCharacter;
}

export function getStatusDetails(statusType: StatusType): {
  icon: string;
  name: string;
} {
  switch (statusType) {
    case StatusType.BLEED:
      return { icon: 'water_drop', name: 'Vérzés' };
    case StatusType.POISON:
      return { icon: 'skull', name: 'Mérgezés' };
    case StatusType.BURN:
      return { icon: 'mode_heat', name: 'Égés' };
    case StatusType.PROSTHETIC:
      return { icon: 'precision_manufacturing', name: 'Protézis' };
    case StatusType.DISADVANTAGE:
      return { icon: 'keyboard_double_arrow_down', name: 'Hátrány' };
    case StatusType.ADVANTAGE:
      return { icon: 'keyboard_double_arrow_up', name: 'Előny' };
    case StatusType.FIRE_RES:
      return { icon: 'shield_with_heart', name: 'Tűzállóság' };
    case StatusType.POISON_RES:
      return { icon: 'health_and_safety', name: 'Méreg ellenállás' };
    case StatusType.STRESS_RES:
      return { icon: 'psychology', name: 'Stressz védelem' };
    case StatusType.FREE_MAGIC:
      return { icon: 'wand_shine', name: 'Ingyen varázslat' };
    case StatusType.FULL_BELLY:
      return { icon: 'restaurant', name: 'Teli has' };
    case StatusType.ANIMAL_TOUNGE:
      return { icon: 'pets', name: 'Állatok nyelve' };
    case StatusType.SLEEP:
      return { icon: 'moon_stars', name: 'Alvás' };
    case StatusType.LOST_LIMB:
      return { icon: 'disabled_by_default', name: 'Elvesztett végtag' };
    case StatusType.DEAD:
      return { icon: 'sentiment_very_dissatisfied', name: 'Halott' };
    case StatusType.INSANE:
      return { icon: 'sentiment_extremely_dissatisfied', name: 'Őrült' };
    default:
      return { icon: '', name: '' };
  }
}

export function getEffectDetails(effectType: EffectType): { icon: string; name: string; } {
  switch (effectType) {
    case EffectType.ADD_STATUS:
      return { icon: 'add', name: 'Státusz adás' };
    case EffectType.REMOVE_STATUS:
      return { icon: 'remove', name: 'Státusz elvétel' };
    case EffectType.BUFF_STAT:
      return { icon: 'trending_up', name: 'Stat erősítés' };
    case EffectType.HEAL_HP:
      return { icon: 'health_metrics', name: 'HP gyógyítás' };
    case EffectType.HEAL_SP:
      return { icon: 'mindfulness', name: 'SP gyógyítás' };
    case EffectType.HEAL_SMALL_WOUND:
      return { icon: 'healing', name: 'Kis seb gyógyítás' };
    case EffectType.HEAL_LARGE_WOUND:
      return { icon: 'femur', name: 'Nagy seb gyógyítás' };
    default:
      return { icon: '', name: '' };
  }
}

export function getStatDetails(stat: string): { icon: string; name: string } {
  switch (stat) {
    case 'str':
      return { icon: 'fitness_center', name: 'Erő' };
    case 'dex':
      return { icon: 'sports_martial_arts', name: 'Ügyesség' };
    case 'end':
      return { icon: 'directions_run', name: 'Kitartás' };
    case 'int':
      return { icon: 'auto_stories', name: 'Ész' };
    case 'cun':
      return { icon: 'psychology', name: 'Fortély' };
    case 'wil':
      return { icon: 'diamond', name: 'Akaraterő' };
    default:
      return { icon: '', name: '' };
  }
}
