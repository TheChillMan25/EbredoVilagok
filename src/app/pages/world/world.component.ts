import { Component } from '@angular/core';
import {
  Card,
  CardContainerComponent,
} from '../../shared/functional/card-container/card-container.component';
import { setBackground } from '../../shared/functional/functions';

@Component({
  selector: 'app-world',
  imports: [CardContainerComponent],
  templateUrl: './world.component.html',
  styleUrl: './world.component.scss',
})
export class WorldComponent {
  cards: Card[] = [
    {
      name: 'Tájak és Királyságok',
      img: 'assets/img/vilag/city.webp',
      id: 'tajak',
    },
    {
      name: 'Fajok és Népek',
      img: 'assets/img/vilag/market.webp',
      id: 'fajok',
    },
    { name: 'Térkép', img: 'assets/img/vilag/terkep.webp', id: 'terkep' },
    {
      name: 'Bestiárium',
      img: 'assets/img/vilag/bestiarium.webp',
      id: 'bestiarium',
    },
  ];

  ngOnInit() {
    setBackground('vilag_bg');
  }
}
