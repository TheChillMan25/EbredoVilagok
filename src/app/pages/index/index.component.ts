import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-index',
  imports: [MatIcon],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
})
export class IndexComponent {
  cards = [
    { name: 'Világ', img: 'assets/img/fooldal/vilag.jpg', id: 'world-img'},
    { name: 'Játék', img: 'assets/img/fooldal/jatek.jpg', id: 'game-img'},
    { name: 'Rendszer', img: 'assets/img/fooldal/rendszer.jpg', id: 'system-img'},
  ];
}
