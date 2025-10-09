import { Component } from '@angular/core';
import { mandatoryCampActions } from '../../actions_harvesting';

@Component({
  selector: 'app-actions-camp',
  imports: [],
  templateUrl: './actions-camp.component.html',
  styleUrls: ['./actions-camp.component.scss', './../../../system_shared.scss'],
})
export class ActionsCampComponent {
  campActions = mandatoryCampActions;
}
