import { Component, EventEmitter, Output } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-delete-warning',
  imports: [MatCheckbox],
  templateUrl: './delete-warning.component.html',
  styleUrl: './delete-warning.component.scss',
})
export class DeleteWarningComponent {
  @Output() deleteEvent = new EventEmitter<void>();
  @Output() closeEvent = new EventEmitter<void>();
  checkboxChange(checked: boolean) {
    localStorage.setItem('deleteNoRemind', checked ? 'true' : 'false');
  }
  delete() {
    this.deleteEvent.emit();
  }
  close() {
    this.closeEvent.emit();
  }
}
