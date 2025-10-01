import { Component } from '@angular/core';
import {
  Card,
  CardContainerComponent,
} from '../../../shared/functional/card-container/card-container.component';
import { setBackground } from '../../../shared/functional/functions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-species',
  imports: [CardContainerComponent],
  templateUrl: './species.component.html',
  styleUrl: './species.component.scss',
})
export class SpeciesComponent {
  cards: Card[] = [
    {
      id: 'folyokoz',
      name: 'Folyóköz',
      img: '/assets/img/regions/folyokoz.jpg',
    },
    {
      id: 'toronyvarosok',
      name: 'Toronyvárosok',
      img: '/assets/img/regions/nuygatitorony.png',
    },
    {
      id: 'kelet_nepe',
      name: 'Kelet népe',
      img: '/assets/img/regions/keletnepe.png',
    },
    {
      id: 'novenyszerzetek',
      name: 'Növényszerzetek',
      img: '/assets/img/regions/novenyszerzet.png',
    },
    {
      id: 'gepszulottek',
      name: 'Gépszülöttek',
      img: '/assets/img/regions/gepszulottek.png',
    },
    {
      id: 'atkozottak',
      name: 'Átkozottak',
      img: '/assets/img/regions/atkozottak.png',
    },
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    setBackground('paper_bg.jpg');
  }

  navigate(path: string) {
    this.router.navigate(['/fajok', path]);
  }
}
