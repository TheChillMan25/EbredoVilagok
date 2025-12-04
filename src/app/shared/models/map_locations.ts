export enum LocationIconType {
  City,
  Town,
  Water,
  Hill,
  Mountain,
  Forest,
  Other,
}

export interface Location {
  id: string;
  name: string;
  desc: string;
  location: { y: number; x: number };
  type: LocationIconType;
}

export const cityLocations: Location[] = [
  {
    id: 'den_karadenn',
    name: 'Den Karadenn',
    desc: 'A Nyugat vasökle, a feketét vérző város. Az északi hegységekben található kifogyhatatlan fém és ikor lelőhelyek az ipar igazi felhőkbe tornyosodó óriásává tette ezt a kis népet. A toronyból folyamatosan folyik a használt, fekete ikor és egész mocsarakat alkotott a ragyogást vesztett folyadék. A földterület szűkösségét terraformáló gépekkel, a kevés harcra képes kezet pedig sokszorosan kiegyensúlyozzák pusztító fegyverekkel.',
    location: { y: 1925, x: 1314 },
    type: LocationIconType.City,
  },
  {
    id: 'alpir',
    name: 'Alpir',
    desc: 'Alpir ',
    location: {
      x: 1072,
      y: 1112,
    },
    type: LocationIconType.City,
  },
  {
    id: 'aldol',
    name: 'Aldol',
    desc: 'Aldol',
    location: {
      x: 1262,
      y: 1145,
    },
    type: LocationIconType.City,
  },
  {
    id: 'cha1',
    name: 'Cha1',
    desc: "Cha'me'rén",
    location: {
      x: 855,
      y: 1500,
    },
    type: LocationIconType.City,
  },
  {
    id: 'cha2',
    name: 'Cha2',
    desc: "Cha'me'rén",
    location: {
      x: 905,
      y: 1400,
    },
    type: LocationIconType.City,
  },
  {
    id: 'cha3',
    name: 'Cha3',
    desc: "Cha'me'rén",
    location: {
      x: 665,
      y: 1480,
    },
    type: LocationIconType.City,
  },
  {
    id: 'felba',
    name: 'Felba',
    desc: 'A Határhegyek szomszédságában fekvő, az egyik legnagyobb folyóközi város. Főleg a könnyűipar és a halászat a domináns. Emellett a turisztika is meghatározó ágazat, a kűzdősportok a városi arénákban igen kedveltté tették a környéken. Megtalálható még itt a vasútnak egy megállója is.',
    location: {
      x: 2138,
      y: 1390,
    },
    type: LocationIconType.City,
  },
  {
    id: 'nulina',
    name: 'Nulina',
    desc: 'Folyóköz legtapasztaltabb fa- és vízimérnökei találhatóak meg itt. Nulinában a fának olyan fontos szerepe van, mint másutt az ételnek vagy az italnak, ezért a növényszerzetek nagy szeretettel vannak fogadva. Az idők kezdetén, mielőtt még kővel építkeztek volna, egy egész faerőd állt a város helyén.',
    location: {
      x: 1681,
      y: 1592,
    },
    type: LocationIconType.City,
  },
  {
    id: 'er_armein',
    name: 'Er Armein',
    desc: 'Folyóköz legnagyobb városa. Rendelkezik egy akadémiával, ahol könnyebb lenne felsorolni mit nem tanítanak (szakállnyírást). Aki erre az akadémiára bekerül, az 30%, hogy beleőrül a tanulmányokba, mielőtt még befejezé azokat. A város nyomornegyede a "Gödör" nevet viseli. Aki ide egyszer lekerül, nehezen tud vissza mászni. A város csendőrei nem szívesen teszik be ide a lábukat.',
    location: {
      x: 2185,
      y: 1557,
    },
    type: LocationIconType.City,
  },
  {
    id: 'kelet1',
    name: 'Kelet1',
    desc: 'Leírás',
    location: {
      x: 3245,
      y: 1030,
    },
    type: LocationIconType.City,
  },
  {
    id: 'kelet2',
    name: 'Kelet2',
    desc: 'Leírás',
    location: {
      x: 2650,
      y: 1560,
    },
    type: LocationIconType.City,
  },
  {
    id: 'kelet3',
    name: 'Kelet3',
    desc: 'Leírás',
    location: {
      x: 2855,
      y: 1240,
    },
    type: LocationIconType.City,
  },
];
export const townLocations: Location[] = [
  {
    id: 'phunor',
    name: 'Phunor',
    desc: 'A folyamokat összekötő csatorna partján található kisváros. Az emberek itt főleg mezőgazdaságból élnek. A település híres arról a gépészműhelyéről, melyben minden gépezet megjavítása lehetséges.',
    location: {
      x: 1922,
      y: 1635,
    },
    type: LocationIconType.Town,
  },
  {
    id: 'harspuszta',
    name: 'Hárspuszta',

    desc: 'Leírás',
    location: {
      x: 1600,
      y: 1495,
    },
    type: LocationIconType.Town,
  },
  {
    id: 'nema_kupola',
    name: 'Néma Kupola',

    desc: 'Leírás',
    location: {
      x: 1476,
      y: 1087,
    },
    type: LocationIconType.Town,
  },
  {
    id: 'kelet4',
    name: 'Kelet4',
    desc: 'Leírás',
    location: {
      x: 2945,
      y: 1085,
    },
    type: LocationIconType.Town,
  },
  {
    id: 'kelet5',
    name: 'Kelet5',
    desc: 'Leírás',
    location: {
      x: 2455,
      y: 1425,
    },
    type: LocationIconType.Town,
  },
];
export const waterLocations: Location[] = [
  {
    id: 'mely_to',
    name: 'Mély tó',

    desc: 'Leírás',
    location: {
      x: 1770,
      y: 1285,
    },
    type: LocationIconType.Water,
  },
  {
    id: 'varangy_to',
    name: 'Varangy tó',

    desc: 'Leírás',
    location: {
      x: 2885,
      y: 1030,
    },
    type: LocationIconType.Water,
  },
  {
    id: 'deli_obol',
    name: 'Déli öböl',
    desc: 'A kontinens déli részén fekvő nagy öböl.',
    location: {
      x: 3350,
      y: 380,
    },
    type: LocationIconType.Water,
  },
];
export const hillLocations: Location[] = [
  {
    id: 'folyokozi_nyugati_dombsag',
    name: 'Folyóközi nyugati dombság',

    desc: 'Leírás',
    location: {
      x: 1650,
      y: 1430,
    },
    type: LocationIconType.Hill,
  },
];
export const mountainLocations: Location[] = [
  {
    id: 'doma',
    name: 'Doma testvér hegyek',
    desc: 'Doma Altiora két testvérvárosának alappillérei.',
    location: {
      x: 1170,
      y: 1100,
    },
    type: LocationIconType.Mountain,
  },
  {
    id: 'ozvegy_szigeti_hegyseg',
    name: 'Özvegy szigeti hegység',
    desc: 'Nincs élettársa, mert senki sem szereti XD.',
    location: {
      x: 2670,
      y: 850,
    },
    type: LocationIconType.Mountain,
  },
  {
    id: 'szigethegyek',
    name: 'Szigethegyek',
    desc: 'A fővárosnak otthont adó központi hegy és a körülötte megtelepedő faragott csúcsok együttes neve. A hegyek belsejében díszes csarnokokat vájtak ki amiket az évszázadok alatt feltöltöttek krónikákkal és hősi halottakkal. A területre jellemző meggyengült gravitációnak köszönhetően lehetetlennek tűnő épületek és természetes képződmények tűzdelik a területet, ilyenek a szigethegyek spirálos kövei amik esőzéskor elterelik a vizeket.',
    location: {
      x: 765,
      y: 1450,
    },
    type: LocationIconType.Mountain,
  },
  {
    id: 'keleti-kozep',
    name: 'Keleti középhegyek',
    desc: 'A Keleti tájék középső részén fekvő hegyek. Az innen eredő források olyan vízet szállítanak a hegyek lábánál fekvő ??? városába, melyeknél tisztábbat nem találni sehol. Egyesek úgy tartják, a víznek mágikus gyógyító hatása van, serkenti a vérkeringést és a csontregenerálódást.',
    location: {
      x: 2920,
      y: 1290,
    },
    type: LocationIconType.Mountain,
  },
];
export const forestLocations: Location[] = [
  {
    id: 'erdo1',
    name: 'Erdő1',
    desc: 'Leírás',
    location: {
      x: 2050,
      y: 1250,
    },
    type: LocationIconType.Forest,
  },
  {
    id: 'erdo2',
    name: 'Erdő2',
    desc: 'Leírás',
    location: {
      x: 1900,
      y: 1500,
    },
    type: LocationIconType.Forest,
  },
  {
    id: 'erdo3',
    name: 'Erdő3',
    desc: 'Leírás',
    location: {
      x: 2700,
      y: 1200,
    },
    type: LocationIconType.Forest,
  },
  {
    id: 'erdo4',
    name: 'Erdő4',
    desc: 'Leírás',
    location: {
      x: 3100,
      y: 1000,
    },
    type: LocationIconType.Forest,
  },
  {
    id: 'erdo5',
    name: 'Erdő5',
    desc: 'Leírás',
    location: {
      x: 3400,
      y: 750,
    },
    type: LocationIconType.Forest,
  },
];
export const otherLocations: Location[] = [
  {
    id: 'gat',
    name: 'Gát',
    desc: 'A Keleti tájék lakói építették még az idők kezdetekor az áradás elleni védekezés céljából. Amikor visszahúzódik a víz, egy masszív falként védi a terület dél-keleti oldalát.',
    location: {
      x: 3200,
      y: 900,
    },
    type: LocationIconType.Other,
  },
];
