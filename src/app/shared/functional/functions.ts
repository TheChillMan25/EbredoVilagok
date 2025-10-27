import { species as Species } from '../../pages/world/species/species_desc_data';

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
  let bonusPoints: number = 2;
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
