import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CardContainerComponent } from "../../shared/functional/card-container/card-container.component";
import { setBackground } from '../../shared/functional/functions';

@Component({
  selector: 'app-index',
  imports: [MatIcon, RouterLink, CardContainerComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
})
export class IndexComponent {
  background: string = '/assets/img/backgrounds/bg.jpg';
  cards = [
    { name: 'Világ', img: 'assets/img/fooldal/vilag.jpg', id: 'world' },
    { name: 'Játék', img: 'assets/img/fooldal/jatek.jpg', id: 'game' },
    { name: 'Rendszer', img: 'assets/img/fooldal/rendszer.jpg', id: 'system' },
  ];

  ngOnInit() {
    setBackground(this.background)
  }
}
