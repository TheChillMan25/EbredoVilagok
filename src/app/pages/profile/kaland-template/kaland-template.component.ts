import { Component, Input } from '@angular/core';
import { Adventure } from '../../../shared/models/models';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-kaland-template',
  imports: [NgClass],
  templateUrl: './kaland-template.component.html',
  styleUrl: './kaland-template.component.scss',
})
export class KalandTemplateComponent {
  @Input() adventure!: Adventure;

  showEvents: boolean = false;

  toggleEvents() {
    this.showEvents = !this.showEvents;
  }
}
