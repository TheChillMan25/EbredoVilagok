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
