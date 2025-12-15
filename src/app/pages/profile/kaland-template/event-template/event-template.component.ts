import { Component, Input } from '@angular/core';
import { AdventureEvent } from '../../../../shared/models/models';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-event-template',
  imports: [NgClass, MatIconModule],
  templateUrl: './event-template.component.html',
  styleUrl: './event-template.component.scss',
})
export class EventTemplateComponent {
  @Input() event!: AdventureEvent;

  visibleNPCs: boolean = false;

  showNPCs() {
    this.visibleNPCs = true;
  }
  hideNPCs() {
    this.visibleNPCs = false;
  }
}
