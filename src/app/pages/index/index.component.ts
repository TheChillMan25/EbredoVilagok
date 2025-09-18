import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-index',
  imports: [MatIcon, RouterLink],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
})
export class IndexComponent {
  cards = [
    { name: 'Világ', img: 'assets/img/fooldal/vilag.jpg', id: 'world' },
    { name: 'Játék', img: 'assets/img/fooldal/jatek.jpg', id: 'game' },
    { name: 'Rendszer', img: 'assets/img/fooldal/rendszer.jpg', id: 'system' },
  ];

  ngOnInit() {
    this.setBackground();
  }

  setBackground(): void {
    const pageElement = document.getElementById('page');
    if (pageElement) {
      pageElement.style.backgroundImage = 'url(/assets/img/backgrounds/bg.jpg)';
    }
  }
}
