import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Adventure } from '../../../shared/models/models';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { EventTemplateComponent } from './event-template/event-template.component';
import { AdventureService } from '../../../shared/services/adventure/adventure.service';
import { DeleteWarningComponent } from '../delete-warning/delete-warning.component';

@Component({
  selector: 'app-kaland-template',
  imports: [NgClass, MatIcon, EventTemplateComponent, DeleteWarningComponent],
  templateUrl: './kaland-template.component.html',
  styleUrls: ['./kaland-template.component.scss', '../template-shared.scss'],
})
export class KalandTemplateComponent {
  @Input() adventure!: Adventure;
  @Input() isPublic: boolean = false;
  @Output() deletedAdventure = new EventEmitter<void>();

  showWarning: boolean = false;

  adventureDetails: boolean = false;

  constructor(private advService: AdventureService) {}

  toggleAdventureDetails() {
    this.adventureDetails = !this.adventureDetails;
  }

  deleteAdventure(event: MouseEvent | null = null) {
    if (event === null) {
      event = new MouseEvent('');
    }
    event.stopPropagation();
    const doNotRemind = localStorage.getItem('deleteNoRemind');

    if (doNotRemind === null) {
      this.showWarning = true;
      localStorage.setItem('deleteNoRemind', 'false');
    }
    if (
      doNotRemind === 'true' ||
      (this.showWarning && doNotRemind === 'false')
    ) {
      if (this.adventure?.id) {
        this.advService.deleteAdventure(this.adventure.id);
        this.deletedAdventure.emit();
      }
    } else if (!this.showWarning && doNotRemind === 'false') {
      this.showWarning = true;
      localStorage.setItem('deleteNoRemind', 'false');
    }
  }

  warningVisible(show: boolean) {
    this.showWarning = show;
  }
}
