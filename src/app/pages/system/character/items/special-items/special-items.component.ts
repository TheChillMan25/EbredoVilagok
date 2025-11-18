import { Component } from '@angular/core';
import { specialDrinks } from '../../../../../shared/models/items';

@Component({
  selector: 'app-special-items',
  imports: [],
  templateUrl: './special-items.component.html',
  styleUrls: ['./special-items.component.scss', '../../../system_shared.scss'],
})
export class SpecialItemsComponent {
  specialDrinks = specialDrinks;
}
