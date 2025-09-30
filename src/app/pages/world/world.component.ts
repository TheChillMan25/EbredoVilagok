import { Component } from '@angular/core';
import { CardContainerComponent } from "../../shared/functional/card-container/card-container.component";
import { setBackground } from '../../shared/functional/functions';

@Component({
  selector: 'app-world',
  imports: [CardContainerComponent],
  templateUrl: './world.component.html',
  styleUrl: './world.component.scss',
})
export class WorldComponent {
  background: string = '/assets/img/backgrounds/vilag_bg.jpg';
  cards = [
    {
      name: 'Tájak és Királyságok',
      img: 'assets/img/vilag/city.jpg',
      id: 'lands&realms',
    },
    {
      name: 'Fajok és Népek',
      img: 'assets/img/vilag/market.jpg',
      id: 'species',
    },
    { name: 'Térkép', img: 'assets/img/vilag/terkep.jpg', id: 'map' },
    {
      name: 'Bestiárium',
      img: 'assets/img/vilag/bestiarium.jpg',
      id: 'bestiary',
    },
  ];

  ngOnInit() {
    setBackground(this.background);
  }
}
