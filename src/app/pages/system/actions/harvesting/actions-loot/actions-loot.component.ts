import { Component } from '@angular/core';
import { harvestingPhases } from '../../actions_harvesting';

@Component({
  selector: 'app-actions-loot',
  imports: [],
  templateUrl: './actions-loot.component.html',
  styleUrls: ['./actions-loot.component.scss', './../../../system_shared.scss'],
})
export class ActionsLootComponent {
  harvestingPhases = harvestingPhases;
}
