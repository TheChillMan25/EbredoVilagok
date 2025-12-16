import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NPC } from '../../../../../shared/models/models';

@Component({
  selector: 'app-npc-template',
  imports: [],
  templateUrl: './npc-template.component.html',
  styleUrl: './npc-template.component.scss',
})
export class NpcTemplateComponent {
  @Input() npc!: NPC;
}
