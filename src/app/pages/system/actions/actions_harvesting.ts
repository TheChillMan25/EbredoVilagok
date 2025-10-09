export const mandatoryCampActions = [
  { name: 'Tűzgyújtás', cost: 3, desc: '' },
  { name: 'Sátrak felállítása', cost: 5, desc: '' },
  { name: 'Csapdák felállítása', cost: 5, desc: '' },
  { name: 'Őrség', cost: 8, desc: '1 vagy 2 fő - 2 fő esetén 4-4 TA' },
];

export const regularCampActions = [
  {
    name: 'Sérülések ápolása',
    cost: 1,
    desc: 'A meglévő eszközökkel begyógyítod a saját vagy a társaid sebeit.',
    methods: [
      {
        name: 'Sebek bekötése, összevarrása',
        prop: 'Kötszerek / Sebvarrótű és cérna',
      },
      {
        name: 'Protézisek felhelyezése',
        prop: 'Protézis',
      },
    ],
  },
  {
    name: 'Társak megnyugtatása',
    cost: 2,
    desc: 'Megpróbálod megnyugtatni társaidat.',
    methods: [
      {
        name: 'Morbid viccek',
        prop: 'CÉ 8 Ész Próba, ha nem sikerül -1 stressz',
      },
      {
        name: 'Történet mesélés',
        prop: 'CÉ 10: Fortély Próba + 1 minden hallgató után',
      },
      {
        name: 'Éneklés',
        prop: 'CÉ 12: Kitartás próba + 1 minden hallgató után',
      },
      {
        name: 'Zenélés',
        prop: 'CÉ 14: Ügyesség próba + 1 minden hallgató után',
      },
    ],
  },
  {
    name: 'Növény gyűjtés',
    cost: 3,
    desc: 'Még a legszárazabb kriptában is találhatók túlélést segítő növények — hasonló a szüreteléshez, de csak egy ember végezheti.',
    methods: [
      {
        name: 'Fűszerek',
        prop: 'CÉ 5: +1 fejadag a meglévő ételekhez',
      },
      {
        name: 'Füvek',
        prop: 'CÉ 10: +1 stressz gyógyulás',
      },
      {
        name: 'Gyógynövények',
        prop: 'CÉ 15: 1 kis seb gyógyítás',
      },
    ],
  },
  {
    name: 'Vadászat',
    cost: 4,
    desc: 'Legyen az egy egész szarvasbika vagy egy öreg patkány, bármi jobb az éhezésnél.',
    methods: [
      {
        name: 'Kis állatok',
        prop: 'CÉ 5: +2 fejadag az ételekhez',
      },
      {
        name: 'Közepes állat',
        prop: 'CÉ 10: +5 fejadag az ételekhez',
      },
      {
        name: 'Nagy állat',
        prop: 'CÉ 15: +8 fejadag az ételekhez',
      },
    ],
  },
];

export const harvestingPhases = [
  {
    name: 'Leírás',
    desc: 'A játékmester felsorolja a lényből kinyerhető nyersanyagokat, amelyek a lénytípushoz tartozó táblázatban találhatók a CÉ értékekkel együtt.',
  },
  {
    name: 'Szüretelési Lista',
    desc: 'A játékosok megbeszélik, mely nyersanyagokat akarják beszüretelni és milyen sorrendben.',
  },
  {
    name: 'Szüretelési Érték Megállapítása',
    desc: 'A játékmester összeadja a kiválasztott alapanyagok CÉ értékeit.',
  },
  {
    name: 'Szüretelés',
    desc: 'A játékosok megkezdik a lény boncolását, nyúzását és lecsapolását. A segítők elvégzik a szükséges dobásokat.',
  },
  {
    name: 'Zsákmányolás',
    desc: 'A dobások eredménye alapján a csapat begyűjti a nyersanyagokat.',
  },
];

export interface HarvestingSizeData {
  size: string;
  time: string;
  helpers: number;
}

export const harvestingSizeData: HarvestingSizeData[] = [
  { size: 'Apró', time: '5 perc', helpers: 0 },
  { size: 'Kicsi', time: '10 perc', helpers: 1 },
  { size: 'Közepes', time: '15 perc', helpers: 2 },
  { size: 'Nagy', time: '30 perc', helpers: 4 },
  { size: 'Hatalmas', time: '2 óra', helpers: 6 },
  { size: 'Óriási', time: '12 óra', helpers: 10 },
];

export interface HarvestingCreature {
  dice: number;
  loot: string;
}

export const displayedHarvestingCreatureColumns = ['dice', 'loot'];

export const harvestingBestia: HarvestingCreature[] = [
  { dice: 5, loot: 'Antenna, szem, hús, szőr, üvegcse vér' },
  {
    dice: 10,
    loot: 'Csontok, agancs, szarv, csőr, tojás, zsír, tarisznya karom, agyar',
  },
  {
    dice: 15,
    loot: 'Üvegcse nyál, máj, fullánk, méregmirigy, tarisznya toll, tarisznya pikkely, csáp',
  },
  { dice: 20, loot: 'Szív, kitin páncél, prém, szárny' },
];

export const harvestingNovenyszerzet: HarvestingCreature[] = [
  { dice: 5, loot: 'Üvegcse gyanta, gumó, csokor ág' },
  {
    dice: 10,
    loot: 'Csokor gyökér, üvegcse wax, tarisznya gomba, tarisznya levél, tarisznya mag',
  },
  { dice: 15, loot: 'Üvegcse pollen, üvegcse spóra' },
  { dice: 20, loot: 'Kéreg, tarisznya virág, központi mag' },
];

export const harvestingGepszulott: HarvestingCreature[] = [
  { dice: 5, loot: 'Üvegcse olaj, fogaskerekek' },
  { dice: 10, loot: 'Páncéllemez, kő, kristály szem' },
  { dice: 15, loot: 'Leírás, protézis' },
  { dice: 20, loot: 'Üvegcse ikor, gépszív, rúnavéset' },
];

export const harvestingTunder = [
  { dice: 5, loot: 'Szem, hús, haj' },
  { dice: 10, loot: 'Tarisznya szárny, csillámpor, üvegcse könny' },
  { dice: 15, loot: 'Tarisznya virág, üvegcse illat, fénylő pikkely' },
  { dice: 20, loot: 'Üvegcse fehér vér, lélekszál, tündérszív' },
];

export const harvestingOrdog: HarvestingCreature[] = [
  { dice: 5, loot: 'Üvegcse kén, izzó szem, szarvmaradvány' },
  { dice: 10, loot: 'Tüzes vér, tarisznya patás láb, démoni csont' },
  { dice: 15, loot: 'Lángoló szív, üvegcse pokoltűz, karmok' },
  { dice: 20, loot: 'Pokoli agyar, démoni bőr, üvegcse lélekhamu' },
];

export const harvestingSarkany: HarvestingCreature[] = [
  { dice: 5, loot: 'Szem, hús, üvegcse vér' },
  { dice: 10, loot: 'Csont, zsír, tarisznya karom, tarisznya fog' },
  { dice: 15, loot: 'Szarv, máj, tarisznya pikkely' },
  { dice: 20, loot: 'Tojás, szív' },
];

export const harvestingDemon: HarvestingCreature[] = [
  { dice: 5, loot: 'Üvegcse árnyvér, démoni nyál, fekete szőr' },
  { dice: 10, loot: 'Tarisznya démonfog, rothadó hús, üvegcse lélekesszencia' },
  { dice: 15, loot: 'Sötét máj, üvegcse démoni méreg, csáp' },
  { dice: 20, loot: 'Halhatatlan szív, démoni szárny, üvegcse pokoli ikor' },
];

export const harvestingEloholt: HarvestingCreature[] = [
  { dice: 5, loot: 'Kiszáradt ujj, szem, üvegcse sűrű vér' },
  { dice: 10, loot: 'Csontvelő, tarisznya fog, romlott zsír' },
  { dice: 15, loot: 'Kiszáradt hús' },
  { dice: 20, loot: 'Üvegcse ikor, halhatatlan szív' },
];

export const harvestingOrias: HarvestingCreature[] = [
  { dice: 5, loot: 'Óriás köröm, bőrredő, üvegcse izomolaj' },
  { dice: 10, loot: 'Csonttöredék, tarisznya óriásfog, zsáknyi vér' },
  { dice: 15, loot: 'Óriás máj, tarisznya szőr, üvegcse csontvelő' },
  { dice: 20, loot: 'Óriás szív, tarisznya agyar, üvegcse óriásikra' },
];

export const harvestingAbominaciok: HarvestingCreature[] = [
  { dice: 5, loot: 'Torz hús, üvegcse nyálka, mutált szem' },
  { dice: 10, loot: 'Tarisznya csáp, rothadó pikkely, üvegcse sav' },
  { dice: 15, loot: 'Mutált szív, tarisznya fog, üvegcse torz vér' },
  {
    dice: 20,
    loot: 'Abnormális agy, üvegcse lélekmaradvány, tarisznya szárny',
  },
];
