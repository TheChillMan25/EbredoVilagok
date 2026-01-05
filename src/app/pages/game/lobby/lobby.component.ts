import { Component, HostListener } from '@angular/core';
import { Game, Player, PlayerStatus } from '../../../shared/models/models';
import { Subscription, take } from 'rxjs';
import {
  PlayerRole,
  GameService,
  checkRole,
} from '../../../shared/services/game/game.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CanComponentDeactivate } from '../../creator/karakter/karakter.component';
import { PlayerTemplateComponent } from '../templates/player-template/player-template.component';
import { EventTemplateComponent } from '../../profile/kaland-template/event-template/event-template.component';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatError } from '@angular/material/form-field';
@Component({
  selector: 'app-lobby',
  imports: [
    PlayerTemplateComponent,
    EventTemplateComponent,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatError,
  ],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.scss',
})
export class LobbyComponent implements CanComponentDeactivate {
  isLoading = false;
  error = '';
  gameId!: string;
  private _currentUserId!: string;
  set currentUserId(value: string) {
    this._currentUserId = value;
  }
  get currentUserId() {
    return this._currentUserId;
  }
  private _role!: PlayerRole;
  set role(value: PlayerRole) {
    this._role = value;
  }
  get role() {
    return this._role;
  }

  PlayerStatus = PlayerStatus;
  PlayerRole = PlayerRole;

  game!: Game;
  dontWarnLeaving = false;
  player!: Player;
  allReady = false;

  gameSub!: Subscription;
  profSub!: Subscription;

  constructor(
    private authService: AuthService,
    private gameService: GameService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async canDeactivate(): Promise<boolean> {
    if (this.dontWarnLeaving) return true;
    if (confirm('Biztosan kilépsz a játékból?')) {
      this.leaveGame();
      return true;
    }
    return false;
  }

  @HostListener('window:beforeunload', ['$event'])
  async unloadNotification($event: any) {
    $event.returnValue = true;
    await this.leaveGame();
    return true;
  }

  ngOnInit() {
    this.gameId = this.route.snapshot.paramMap.get('id') || '';
    this.authService.currentUser.pipe(take(1)).subscribe((user) => {
      this.currentUserId = user!.uid;
    });
    this.loadGameData();
  }

  ngOnDestroy() {
    if (this.gameSub) this.gameSub.unsubscribe();
  }

  async loadGameData() {
    try {
      if (this.gameId === '') {
        this.router.navigate(['/jatek']);
        return;
      }
      this.isLoading = true;
      this.gameSub = this.gameService
        .getGame(this.gameId)
        .subscribe((value) => {
          this.game = value;
          this.role = checkRole(this.currentUserId, this.game.ownerId);
          if (this.role === PlayerRole.PLAYER) {
            this.player = this.game.players.find(
              (p) => p.userId === this.currentUserId
            )!;
          } else if (this.game.players) {
            this.allReady = this.game.players.every(
              (p) => p.status === PlayerStatus.READY
            );
          }
          if (this.game.started) {
            this.dontWarnLeaving = true;
            this.router.navigate(['jatek/', this.gameId]);
          } else if (!this.game.isOpen && this.role === PlayerRole.PLAYER) {
            this.dontWarnLeaving = true;
            this.leaveGame();
          } else if (
            !this.game.players.find((p) => p.userId === this.currentUserId) &&
            this.role === PlayerRole.PLAYER
          ) {
            this.dontWarnLeaving = true;
            this.leaveGame();
          }
        });
      this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
      console.error(error);
    }
  }

  async leaveGame() {
    try {
      this.isLoading = true;
      this.dontWarnLeaving = true;
      await this.gameService.leaveGame(this.gameId, this.role);
      this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
      error = 'Hiba ajáték elhagyásakor!';
      console.error('Hiba a játék elhagyásakor: ', error);
    }
  }

  async kickPlayer(id: string) {
    try {
      if (!this.game.players.find((p) => p.userId === id)) {
        return;
      }
      const updatedPlayers = this.game.players.filter((p) => p.userId !== id);
      await this.gameService.updateGame(this.gameId, {
        players: updatedPlayers,
      });
    } catch (error) {
      console.error('Hiba a felhasználó kirúgásakor');
      return;
    }
  }

  async ready() {
    try {
      if (this.role !== PlayerRole.PLAYER) return;
      if (!this.game.players.find((p) => p.userId === this.currentUserId)) {
        return;
      }
      const updatedPlayers = this.game.players.map((player) => {
        if (player.userId === this.currentUserId) {
          return {
            ...player,
            status:
              player.status === PlayerStatus.READY
                ? PlayerStatus.NOTREADY
                : PlayerStatus.READY,
          };
        }
        return player;
      });
      await this.gameService.updateGame(this.gameId, {
        players: updatedPlayers,
      });
    } catch (error) {
      console.error('Hiba ready-kor: ', error);
      return;
    }
  }

  async startGame() {
    try {
      if (this.game.players.length === 0) {
        this.error = 'Nincsenek játékosok!';
        return;
      }
      if (!this.allReady) {
        this.error =
          'Nem indítható el a játék, mert még nem mindenki áll készen!';
        return;
      }

      await this.gameService.updateGame(this.gameId, {
        started: true,
        isOpen: false,
      });
    } catch (error) {
      this.error = 'Hiba a játék indításakor!';
      console.error('Hiba a játék indításakor: ', error);
      return;
    }
  }
}
