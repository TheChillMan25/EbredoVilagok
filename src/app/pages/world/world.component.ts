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
  background: string = 'vilag_bg.jpg';
  cards: Card[] = [
    {
      name: 'Tájak és Királyságok',
      img: 'assets/img/vilag/city.jpg',
      id: 'tajak',
    },
    {
      name: 'Fajok és Népek',
      img: 'assets/img/vilag/market.jpg',
      id: 'fajok',
    },
    { name: 'Térkép', img: 'assets/img/vilag/terkep.jpg', id: 'terkep' },
    {
      name: 'Bestiárium',
      img: 'assets/img/vilag/bestiarium.jpg',
      id: 'bestiarium',
    },
  ];

  ngOnInit() {
    setBackground(this.background);
  }
}
