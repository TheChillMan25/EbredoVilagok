import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CardContainerComponent } from '../../shared/functional/card-container/card-container.component';
import { setBackground } from '../../shared/functional/functions';
import { ItemService } from '../../shared/services/item/item.service';

@Component({
  selector: 'app-index',
  imports: [MatIcon, RouterLink, CardContainerComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
})
export class IndexComponent {
  cards = [
    { name: 'Világ', img: 'assets/img/fooldal/vilag.webp', id: 'vilag' },
    { name: 'Játék', img: 'assets/img/fooldal/jatek.webp', id: 'jatek' },
    {
      name: 'Rendszer',
      img: 'assets/img/fooldal/rendszer.webp',
      id: 'rendszer',
    },
  ];
  constructor(private itemsService: ItemService) {}

  async ngOnInit() {
    setBackground('bg');
    await this.uploadItems();
    await this.initItems();
  }

  async uploadItems() {
    try {
      await this.itemsService.uploadItems();
    } catch (error) {
      console.error('Hiba a tárgyak feltöltésekor: ', error);
    }
  }

  async initItems() {
    try {
      await this.itemsService.initItems();
    } catch (error) {
      console.error('Hiba a tárgyak betöltésekor: ', error);
    }
  }
}
