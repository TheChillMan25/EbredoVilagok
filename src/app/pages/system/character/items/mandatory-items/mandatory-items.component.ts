import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-mandatory-items',
  imports: [MatTableModule],
  templateUrl: './mandatory-items.component.html',
  styleUrls: [
    './mandatory-items.component.scss',
    '../../../system_shared.scss',
  ],
})
export class MandatoryItemsComponent {
  foodRations = [
    {
      name: 'Silány',
      portion: 1,
      desc: 'száraz kenyér',
      heal: 0,
    },
    {
      name: 'Szerény',
      portion: 2,
      desc: 'kemény sajt és aszalt gyümölcsök',
      heal: 1,
    },
    {
      name: 'Elégséges',
      portion: 3,
      desc: 'szárított hús friss zöldségekkel',
      heal: 2,
    },
    {
      name: 'Bőséges',
      portion: 4,
      desc: 'sülthús, puha kenyér és sütemény',
      heal: 3,
    },
  ];

  medicalItems = [
  {
    name: 'Kötszerek',
    desc: 'Hófehér szövetköteg, amit a világon mindenhol használnak. A szövetnek enyhe alkohol szaga van.',
    effect: '1 kis sebet gyógyít be',
  },
  {
    name: 'Sebvarró tű és cérna',
    desc: 'Görbe fém tű és egy köteg erős cérna. A tű olyan éles, hogy alig érzed meg ahogy áthatol a bőrödön.',
    effect: '2 kis sebet gyógyít be',
  },
  {
    name: 'Fájdalomcsillapító (HK)',
    desc: 'Kis kapszula zsibbasztó anyagokkal, ízre enyhén édes.',
    effect: 'Gyógyulsz 1 stresszt',
  },
  {
    name: 'Nyugtató füstölő',
    desc: 'Egyszerű fém füstölő nyugtató füvekkel, az illatától minden színesebb lesz.',
    effect: 'Gyógyulsz 2 stresszt és minden 1 mezőre lévő szövetséges karakter szintén gyógyul 1 stresszt',
  },
  {
    name: 'Sebforrasztó (HK)',
    desc: 'Egy rúnákkal televésett fémlap. Ha egy kemény tárgynak nekiütjük, elkezd felhevülni és képes beforrasztani bármilyen nyílt sebet.',
    effect: 'Elállítja a vérzést',
  },
  {
    name: 'Fertőtlenítő kenőcs (HK)',
    desc: 'Különböző gyógyfüvekből és állati részekből kikevert kenőcs fém tubusban. Az illata olyan, mint a méznek és a rothadásnak.',
    effect: 'Tűzállóvá teszi és enyhíti az égett bőrt. Elállítja és megakadályozza az égést',
  },
  {
    name: 'Ellenméreg (HK)',
    desc: 'Holtágiak és mérgező lények nyálmirigyeiből készült, halványzöld, keserű ital.',
    effect: 'A legtöbb közönséges mérget hatástalanítja',
  },
  {
    name: 'Gyógyító injekció (HK)',
    desc: 'Ikorból készült injekció, a szúrás után olyan mintha az egész tested vízbe dobták volna.',
    effect: 'Azonnal begyógyít 1 kis sebet. Függőséget tud okozni',
  },
  {
    name: 'Gyógyító főzet (HK)',
    desc: 'Ikor alapú bájital viasszal lezárt nehéz üvegben. A folyadék megállás nélkül kavarog benne.',
    effect: 'Azonnal begyógyít 2 kis sebet. Nagyobb eséllyel függőséget tud okozni',
  },
  {
    name: 'Protézis',
    desc: 'Egy ideiglenes, állítható fém művégtag, amit szükség esetén műtét és érzéstelenítő nélkül fel lehet szerelni.',
    effect: 'Egy nagy sebet semlegesít, de a végtaggal kapcsolatos próbákra hátrányt kapsz',
  },
];


  foodRationDataSource = new MatTableDataSource<any>(this.foodRations);
  displayedColumns = ['silany', 'szereny', 'elegseges', 'boseges'];
}
