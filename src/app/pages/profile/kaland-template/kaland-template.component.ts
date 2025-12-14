import { Component, Input } from '@angular/core';
import { Adventure } from '../../../shared/models/models';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { EventTemplateComponent } from './event-template/event-template.component';

@Component({
  selector: 'app-kaland-template',
  imports: [NgClass, MatIcon, EventTemplateComponent],
  templateUrl: './kaland-template.component.html',
  styleUrl: './kaland-template.component.scss',
})
export class KalandTemplateComponent {
  @Input() adventure!: Adventure;

  adventureDetails: boolean = false;

  toggleAdventureDetails() {
    this.adventureDetails = !this.adventureDetails;
  }
}
