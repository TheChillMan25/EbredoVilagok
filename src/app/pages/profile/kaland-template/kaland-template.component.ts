import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Adventure } from '../../../shared/models/models';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { EventTemplateComponent } from './event-template/event-template.component';
import { AdventureService } from '../../../shared/services/adventure/adventure.service';

@Component({
  selector: 'app-kaland-template',
  imports: [NgClass, MatIcon, EventTemplateComponent],
  templateUrl: './kaland-template.component.html',
  styleUrl: './kaland-template.component.scss',
})
export class KalandTemplateComponent {
  @Input() adventure!: Adventure;
  @Output() deletedAdventure = new EventEmitter<void>();

  adventureDetails: boolean = false;

  constructor(private advService: AdventureService) {}

  toggleAdventureDetails() {
    this.adventureDetails = !this.adventureDetails;
  }

  deleteAdventure(event: MouseEvent) {
    event.stopPropagation();
    if (this.adventure?.id) {
      this.advService.deleteAdventure(this.adventure.id);
      this.deletedAdventure.emit();
    }
  }
}
