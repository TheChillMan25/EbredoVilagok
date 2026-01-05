import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Player, PlayerStatus } from '../../../../shared/models/models';
import { KarakterTemplateComponent } from '../../../profile/karakter-template/karakter-template.component';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { PlayerRole } from '../../../../shared/services/game/game.service';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-player-template',
  imports: [KarakterTemplateComponent, NgClass, MatIconModule, MatTooltip],
  templateUrl: './player-template.component.html',
  styleUrl: './player-template.component.scss',
})
export class PlayerTemplateComponent {
  @Input() player!: Player;
  @Input() role!: PlayerRole;
  @Output() kickPlayerEvent = new EventEmitter<string>();
  PlayerStatus = PlayerStatus;
  showCharacter = false;

  toggleCharacter() {
    this.showCharacter = !this.showCharacter;
  }

  kickPlayer() {
    if (this.role === PlayerRole.HOST)
      this.kickPlayerEvent.emit(this.player.userId);
  }
}
