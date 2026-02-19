import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { Food, Item, SpecialItem } from '../../../../shared/models/game_interfaces';

@Component({
  selector: 'app-item',
  imports: [MatTooltip, NgClass, MatIcon],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss',
})
export class ItemComponent {
  @Input() item!: Food | SpecialItem | Item;
  @Input() canUse = false;
  @Input() host = false;
  @Input() lootable = false;
  @Input() looted = false;
  @Input() trade = false;
  @Input() sell = false;
  @Input() inCart = false;
  @Input() pieces?: number;
  @Output() selectItemEvent = new EventEmitter<void>();
  @Output() lootItemEvent = new EventEmitter<Food | SpecialItem | Item>();
  @Output() putBackEvent = new EventEmitter<Food | SpecialItem | Item>();
  @Output() buyItemEvent = new EventEmitter<Food | SpecialItem | Item>();
  @Output() sellItemEvent = new EventEmitter<Food | SpecialItem | Item>();

  selectItem() {
    if (!this.host)
      this.selectItemEvent.emit();
  }

  lootItem() {
    if (this.lootable) this.lootItemEvent.emit(this.item);
  }
  putBack() {
    if (this.looted || this.inCart) this.putBackEvent.emit(this.item);
  }
  buyItem() {
    if (this.trade) this.buyItemEvent.emit(this.item);
  }
  sellItem() {
    if (this.sell) this.sellItemEvent.emit(this.item);
  }
}
