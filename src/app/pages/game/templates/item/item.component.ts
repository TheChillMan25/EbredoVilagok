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
  @Output() selectItemEvent = new EventEmitter<void>();

  selectItem() {
    if(!this.host)
    this.selectItemEvent.emit();
  }
}
