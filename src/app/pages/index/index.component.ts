import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CardContainerComponent } from '../../shared/functional/card-container/card-container.component';
import { setBackground } from '../../shared/functional/functions';

@Component({
  selector: 'app-index',
  imports: [MatIcon, RouterLink, CardContainerComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
})
export class IndexComponent {
  background: string = 'bg.jpg';
  cards = [
    { name: 'Világ', img: 'assets/img/fooldal/vilag.jpg', id: 'vilag' },
    { name: 'Játék', img: 'assets/img/fooldal/jatek.jpg', id: 'jatek' },
    { name: 'Rendszer', img: 'assets/img/fooldal/rendszer.jpg', id: 'rendszer' },
  ];

  ngOnInit() {
    setBackground(this.background);
  }
}
