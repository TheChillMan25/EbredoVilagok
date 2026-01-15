import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NPC, Player } from '../../../../shared/models/models';
import { NgClass } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import {
  EffectType,
  StatusType,
} from '../../../../shared/models/game_interfaces';
import { getStatusDetails } from '../../../../shared/functional/functions';

@Component({
  selector: 'app-player-npc',
  imports: [NgClass, MatTooltipModule, MatIconModule],
  templateUrl: './player-npc.component.html',
  styleUrl: './player-npc.component.scss',
})
export class PlayerNpcComponent {
  @Input() object?: Player | NPC;
  @Input() selectedTargetId?: string;
  @Input() myTurn?: boolean;
  @Input() currentPlayer?: string;
  @Input() role? = '';
  @Output() clickedEvent = new EventEmitter<void>();

  get hasPrimaryAction(): boolean {
    const actionsLeft = this.object?.actionsLeft;
    if (
      actionsLeft &&
      !Array.isArray(actionsLeft) &&
      'primary' in actionsLeft
    ) {
      return (actionsLeft as { primary: boolean }).primary;
    }
    return false;
  }

  get hasSecondaryAction(): boolean {
    const actionsLeft = this.object?.actionsLeft;
    if (
      actionsLeft &&
      !Array.isArray(actionsLeft) &&
      'secondary' in actionsLeft
    ) {
      return (actionsLeft as { secondary: boolean }).secondary;
    }
    return false;
  }

  getStatusDetails(statusType: StatusType) {
    return getStatusDetails(statusType);
  }

  clicked() {
    this.clickedEvent.emit();
  }
}
