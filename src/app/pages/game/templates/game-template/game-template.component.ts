import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Game } from '../../../../shared/models/models';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';


@Component({
  selector: 'app-game-template',
  imports: [MatIcon, MatTooltip],
  templateUrl: './game-template.component.html',
  styleUrl: './game-template.component.scss',
})
export class GameTemplateComponent {
  @Input() game!: Game;
  @Input() type!: 'myGame' | 'general';
  @Output() deleteGameEvent = new EventEmitter<string>();
  @Output() gameEvent = new EventEmitter<{
    type: 'myGame' | 'general';
    gameId: string;
  }>();

  buttonClicked() {
    this.gameEvent.emit({ type: this.type, gameId: this.game.id });
  }
  deleteClicked() {
    if (this.type === 'myGame')
      this.deleteGameEvent.emit(this.game.id);
  }
}
