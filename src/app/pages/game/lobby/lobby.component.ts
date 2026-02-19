import { Component, HostListener } from '@angular/core';
import { Game, Player, PlayerStatus } from '../../../shared/models/models';
import { firstValueFrom, Subscription, take } from 'rxjs';
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
import { setBackground } from '../../../shared/functional/functions';
import { MatIconModule } from '@angular/material/icon';
import { VoiceService } from '../../../shared/services/voice/voice.service';
import { MatCardModule } from '@angular/material/card';
import { MatTooltip } from "@angular/material/tooltip";
import { FormBuilder, FormGroup, ɵInternalFormsSharedModule } from '@angular/forms';
import { MatLabel } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';
import { ReactiveFormsModule } from '@angular/forms';
import { isMobileView } from '../../map/map.component';
import { SmallScreenComponent } from '../../../shared/functional/small-screen/small-screen.component';
import { UserService } from '../../../shared/services/user/user.service';
@Component({
  selector: 'app-lobby',
  imports: [
    PlayerTemplateComponent,
    EventTemplateComponent,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatCardModule,
    MatTooltip,
    MatLabel,
    MatSliderModule,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
    SmallScreenComponent
  ],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.scss',
})
export class LobbyComponent implements CanComponentDeactivate {
  smallScreen = false;
  isLoading = false;
  voiceInitialized = false;
  starting = false;
  ownerVolumeSettingVisible = false;
  error = '';
  gameId!: string;
  ownerConnected = false;
  voiceStream?: MediaStream;
  private _currentUserId!: string;
  performingReady = false;
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
  ownerVoiceSub!: Subscription;

  volumeForm: FormGroup = new FormBuilder().group({
    volume: [0.5]
  });

  constructor(
    private authService: AuthService,
    private gameService: GameService,
    private router: Router,
    private route: ActivatedRoute,
    private voiceService: VoiceService,
    private userService: UserService
  ) { }

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

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.smallScreen = isMobileView();
  }

  async ngOnInit() {
    this.smallScreen = isMobileView();
    setBackground('#222', true);
    this.gameId = this.route.snapshot.paramMap.get('id') || '';
    const user = await firstValueFrom(this.authService.currentUser.pipe(take(1)))
    this.currentUserId = user?.uid!;
    this.loadGameData();
  }

  ngOnDestroy() {
    if (this.gameSub) this.gameSub.unsubscribe();
    if (this.ownerVoiceSub) this.ownerVoiceSub.unsubscribe();
  }

  loadGameData() {
    try {
      if (this.gameId === '') {
        this.router.navigate(['/jatek']);
        return;
      }
      this.isLoading = true;
      this.gameSub = this.gameService.getGame(this.gameId).subscribe(async (game) => {
        if (!game) {
          this.dontWarnLeaving = true;
          this.router.navigateByUrl('/jatek');
          return;
        }
        this.game = game;
        if (!this.ownerVoiceSub) {
          this.ownerVoiceSub = this.voiceService.activePeers.subscribe(peers => {
            this.ownerConnected = peers.includes(this.game.ownerId);
          });
        }
        this.role = checkRole(this.currentUserId, this.game.ownerId);
        if (!this.voiceInitialized && this.game.players) {
          this.joinVoiceChat();
          this.voiceInitialized = true;
        }
        if (this.role === PlayerRole.PLAYER) {
          this.player = this.game.players.find(
            (p) => p.id === this.currentUserId
          )!;
        } else if (this.game.players) {
          this.allReady = this.game.players.every(
            (p) => p.status === PlayerStatus.READY
          );
        }
        const started = this.game.started;
        const closed = !this.game.isOpen && this.role === PlayerRole.PLAYER;
        const notInPlayers = !this.game.players.find((p) => p.id === this.currentUserId) && this.role === PlayerRole.PLAYER;
        if (closed || notInPlayers || started) {
          this.dontWarnLeaving = true;
          this.router.navigate(['jatek/', this.gameId]);
          if (closed || notInPlayers) this.voiceService.destroy();
          if(notInPlayers){
            await this.userService.updateUser(this.currentUserId, { inGame: false });
          }
        }
      });
      this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
      console.error(error);
    }
  }

  goHome() {
    this.dontWarnLeaving = true;
    this.router.navigateByUrl('/index');
  }

  async leaveGame() {
    try {
      this.isLoading = true;
      this.dontWarnLeaving = true;
      await this.gameService.leaveGame(this.gameId, this.role);
      this.voiceService.destroy();
      this.router.navigateByUrl('/jatek');
    } catch (error) {
      this.isLoading = false;
      console.error('Hiba a játék elhagyásakor: ', error);
    }
  }

  async kickPlayer(id: string) {
    try {
      if (!this.game.players.find((p) => p.id === id)) {
        return;
      }
      const updatedPlayers = this.game.players.filter((p) => p.id !== id);
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
      if (!this.game.players.find((p) => p.id === this.currentUserId)) {
        return;
      }
      this.performingReady = true;
      const updatedPlayers = this.game.players.map((player) => {
        if (player.id === this.currentUserId) {
          return {
            ...player,
            inCombat: this.game?.camp?.raid?.length > 0,
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
      setTimeout(() => {
        this.performingReady = false;
      }, 1000);
    } catch (error) {
      this.performingReady = false;
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
      this.starting = true;
      let playerOrder: { id: string; initiative: number; finished: boolean }[] =
        [];
      const ca = Math.ceil(21 / this.game.players.length) + 4;
      this.game.players.forEach((p) => {
        p.campActionPoints = ca + p.character?.stats?.physical?.end!;
        p.initiative = Math.ceil(Math.random() * 20);
        playerOrder.push({
          id: p.id,
          initiative: p.initiative,
          finished: false,
        });
      });
      playerOrder.sort((a, b) => b.initiative - a.initiative);
      const firstPlayer = playerOrder[0].id;

      const updateData = {
        started: true,
        isOpen: false,
        players: this.game.players,
        playerOrder: playerOrder,
        currentPlayer: firstPlayer,
      };

      await this.gameService.updateGame(this.gameId, updateData);
    } catch (error) {
      this.starting = false;
      this.error = 'Hiba a játék indításakor!';
      console.error('Hiba a játék indításakor: ', error);
      return;
    }
  }

  async joinVoiceChat() {
    try {
      this.voiceStream = await this.voiceService.getMicrophone();
      this.voiceService.initPeer(this.currentUserId);
      setTimeout(() => {
        if (this.game.ownerId !== this.currentUserId) this.voiceService.connectToPeer(this.game.ownerId);
        this.game.players.forEach((p) => {
          if (p.id !== this.currentUserId) {
            this.voiceService.connectToPeer(p.id);
          }
        });
      }, 1000);
    } catch (error: any) {
      console.error('Hiba a csatlakozáskor:', error);
      alert('Nem sikerült csatlakozni a híváshoz. Engedélyezd a mikrofon használatát, és próbáld újra!');
    }
  }

  isMuted(): boolean {
    return this.voiceService.muted();
  }

  isDeafened(): boolean {
    return this.voiceService.deafened();
  }

  toggleMute() {
    switch (this.voiceService.muted()) {
      case true:
        this.voiceService.unMute();
        break;
      case false:
        this.voiceService.mute();
        break;
    }
  }

  toggleDeafen() {
    switch (this.voiceService.deafened()) {
      case true:
        this.voiceService.unDeafen();
        break;
      case false:
        this.voiceService.deafen();
        break;
    }
  }

  leaveCall() {
    this.voiceStream = undefined;
    this.voiceService.destroy();
  }

  setVolume({ id, value }: { id: string, value: number }) {
    this.voiceService.setPeerVolume(id, value);
  }
}