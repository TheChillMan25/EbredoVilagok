import { species as Species } from '../../pages/world/species/species_desc_data';
import { Character } from '../models/models';
import { NationData } from '../models/NationData';
import { classes } from '../models/classes';
import { weapons, armours } from '../models/equipment';
import {
  foodRations,
  items,
  medicalItems,
  specialDrinks,
} from '../models/items';
import {
  CharacterVirtues,
  CharacterDisadvantages,
} from '../models/virtues_disadvantages';

let virtues = CharacterVirtues.map((virtue) => virtue.name);
let disadvantages = CharacterDisadvantages.map((disadv) => disadv.name);
let specialItems = medicalItems
  .map((item) => item.name)
  .concat(specialDrinks.map((drink) => drink.name));

export function setBackground(path: string, color: boolean = false) {
  const pageElement = document.getElementById('page');
  if (pageElement && !color) {
    pageElement.style.background = `url(/assets/img/backgrounds/${path})`;
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
  if (speciesObj && index)
    return Species[speciesObj?.landID][speciesObj?.speciesID].homes[index];
  else return { desc: '', bonus: [] };
}

export function getSpeciesSpecial(
  species: string | undefined,
  index: number | undefined
): { desc: string } {
  let speciesObj = convertSpeciesNameToKey(species);
  if (speciesObj && index)
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

  //checkStatNumbers(stats);

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

const edges = [6, 8, 12, 14, 16];
export function checkStatNumbers(numbers: number[]) {
  let onEdges: number[] = [];
  for (let number of numbers) {
    for (let edge of edges) {
      if (number === edge || number === edge - 1) {
        onEdges.push(number);
      }
    }
  }
  console.log('On edges: ' + onEdges);
}

export function createRandomCharacter(charName: string): Omit<Character, 'id'> {
  if (typeof charName !== 'string')
    throw new Error('Nem megfelelő névérték: ' + charName);
  console.log(charName);
  let stats = createStats();
  let randomCharacter: Omit<Character, 'id'> = {
    currentAdventure: '',
    name: charName || '',
    species: NationData.map((nation) => nation.nationName)[
      Math.floor(Math.random() * 17)
    ],
    class: classes[Math.max(Math.floor(Math.random() * classes.length - 1))],
    level: 1,
    specialProperties: {
      speciesProperty: Math.floor(Math.random() * 6),
      home: Math.floor(Math.random() * 6),
    },
    stats: {
      physical: {
        ero: getStat(stats),
        ugyesseg: getStat(stats),
        kitartas: getStat(stats),
      },
      mental: {
        esz: getStat(stats),
        fortely: getStat(stats),
        akaratero: getStat(stats),
      },
      main: {
        hp: Math.ceil(Math.random() * 6),
        sp:
          Math.ceil(Math.random() * 4) +
          Math.ceil(Math.random() * 4) +
          Math.ceil(Math.random() * 4),
      },
    },
    equipment: {
      left: Math.max(Math.floor(Math.random() * weapons.length - 1), 0),
      right: Math.max(Math.floor(Math.random() * weapons.length - 1), 0),
      armour: Math.max(Math.floor(Math.random() * armours.length - 1), 0),
    },
    virtues: {
      virtues: [
        Math.max(Math.floor(Math.random() * virtues.length - 1), 0),
        Math.max(Math.floor(Math.random() * virtues.length - 1), 0),
      ],
      disadv: [
        Math.max(Math.floor(Math.random() * disadvantages.length - 1), 0),
      ],
    },
    items: {
      food: [Math.max(Math.floor(Math.random() * foodRations.length - 1), 0)],
      specialItems: [
        Math.max(Math.floor(Math.random() * specialItems.length - 1), 0),
        Math.max(Math.floor(Math.random() * specialItems.length - 1), 0),
        Math.max(Math.floor(Math.random() * specialItems.length - 1), 0),
      ],
      otherItems: [
        Math.floor(Math.random() * 99),
        Math.floor(Math.random() * 99),
        Math.floor(Math.random() * 99),
        Math.floor(Math.random() * 99),
        Math.floor(Math.random() * 99),
      ],
      weaponItems: [],
    },
  };
  return randomCharacter;
}

export function getItem(type: string, index: number) {
  const map: Record<string, any> = {
    food: foodRations,
    otherItems: items,
    specialItems: medicalItems.concat(specialDrinks),
  };

  if (map[type][index]) {
    return map[type][index];
  }
}
