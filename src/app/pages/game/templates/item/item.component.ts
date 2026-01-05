import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  Food,
  GeneralItem,
  SpecialItem,
} from '../../../../shared/models/items';
import { MatTooltip } from '@angular/material/tooltip';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-item',
  imports: [MatTooltip, NgClass, MatIcon],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss',
})
export class ItemComponent {
  @Input() item!: Food | SpecialItem | GeneralItem;
  @Input() canUse = false;
  @Output() selectItemEvent = new EventEmitter<void>();

  selectItem() {
    this.selectItemEvent.emit();
  }
}
