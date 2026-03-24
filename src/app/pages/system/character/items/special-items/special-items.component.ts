import { Component, Input } from '@angular/core';
import { SpecialItem } from '../../../../../shared/models/game_interfaces';
import { ItemService } from '../../../../../shared/services/item/item.service';

@Component({
  selector: 'app-special-items',
  imports: [],
  templateUrl: './special-items.component.html',
  styleUrls: ['./special-items.component.scss', '../../../system_shared.scss'],
})
export class SpecialItemsComponent {
  _specialDrinks?: SpecialItem[];
  @Input() set specialDrinks(value: SpecialItem[] | undefined) {
    if (value && value.length > 0) {
      this._specialDrinks = value;
    }
  }
}
