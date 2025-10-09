import { Component } from '@angular/core';

@Component({
  selector: 'app-special-items',
  imports: [],
  templateUrl: './special-items.component.html',
  styleUrls: ['./special-items.component.scss', '../../../system_shared.scss'],
})
export class SpecialItemsComponent {
  specialDrinks = [
    {
      name: 'Busóvér',
      desc: 'Kúszóerdő kéreg vodka és füvekből készítik. Fekete, sűrű ital, olyan mintha kátrányt innál. Az illata olyan, mint az aszalt gyümölcsöké. Az íze kissé fémes.',
      effect: '10 percig előnyt kapsz minden erőpróbábra.',
    },
    {
      name: 'Az istenek könnye',
      desc: 'A tiszta ikort gyümölcsök levével, alkohollal és vízzel higítják fel. Kinézetre olyan, mint egy folyékony prizma. Nincs illata, ízre olyan, mint egy szivárvány.',
      effect:
        '5 percig a következő varázslatod ár megfizetése nélkül tudod használni.',
    },
    {
      name: 'Tündérméz',
      desc: 'A tündérligeti fák édes gyantájából és gyümölcslikőrből készítik. Úgy néz ki, mint a higított, szürke méz. Ízre olyan, mint egy szerető bőrének.',
      effect:
        'Erős altató hatása van, akár egy napon keresztül is alszik az elfogyasztója, ha meg nem zavarják.',
    },
    {
      name: 'Bitómámor',
      desc: 'Erős vodka és füvek egyvelege, a kivégzés előtti embereknek szokták adni, hogy megnyugtassák őket. Olyan az íze, mint az illóolajnak.',
      effect:
        'Egy óráig nem tud idegösszeroppanást kapni az elfogyasztója, a hatás lejárta után viszont az összes elszenvedett stressz sebzést megkapja.',
    },
    {
      name: 'Monyóktej',
      desc: 'Tejből, gyümölcspálinkából és gyümölcsléből készítik a ligeti pásztorok. A pálinka és gyümölcslé fajtája mindig megegyezik. Az üvegben a gyümölcsdarabok folyamatosan hullanak, mint a levelek, az íze olyan, mint az édes titkoknak.',
      effect: '10 percig beszélni tudsz az állatok nyelvén a környezetedben.',
    },
    {
      name: 'Sen Altio',
      desc: 'Hófehér rum, virágok és tengeri növényekből forralják össze. Az üvegcserepes város nemzeti itala. Az íze keserű, mint a búcsúé.',
      effect: 'A táborozásnál felér egy elégséges étkezéssel.',
    },
  ];
}
