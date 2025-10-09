import { Component, EventEmitter, Output } from '@angular/core';
import { regularCampActions } from '../../actions_harvesting';

@Component({
  selector: 'app-actions-camp2',
  imports: [],
  templateUrl: './actions-camp2.component.html',
  styleUrls: ['./actions-camp2.component.scss', './../../../system_shared.scss'],
})
export class ActionsCamp2Component {
  @Output() showEvent = new EventEmitter<number>();

  regularCampActions = regularCampActions;

  showPage(index: number) {
    this.showEvent.emit(index);
  }
}
