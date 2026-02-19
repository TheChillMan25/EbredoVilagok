import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Player, PlayerStatus } from '../../../../shared/models/models';
import { KarakterTemplateComponent } from '../../../profile/karakter-template/karakter-template.component';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { PlayerRole } from '../../../../shared/services/game/game.service';
import { MatTooltip } from '@angular/material/tooltip';
import { VoiceService } from '../../../../shared/services/voice/voice.service';
import { firstValueFrom, Subscription, take } from 'rxjs';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';
import { FormBuilder, FormGroup, FormsModule } from "@angular/forms";
import { AuthService } from '../../../../shared/services/auth/auth.service';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-player-template',
  imports: [ReactiveFormsModule, KarakterTemplateComponent, NgClass, MatIconModule, MatTooltip, MatFormFieldModule, MatLabel, MatSliderModule, FormsModule],
  templateUrl: './player-template.component.html',
  styleUrl: './player-template.component.scss',
})
export class PlayerTemplateComponent {
  @Input() player!: Player;
  @Input() role!: PlayerRole;
  @Output() kickPlayerEvent = new EventEmitter<string>();
  @Output() volumeEvent = new EventEmitter<{ id: string, value: number }>();

  PlayerStatus = PlayerStatus;
  PlayerRole = PlayerRole;
  showCharacter = false;
  isSpeaking = false;
  volumeSettingsVisible = false;
  isConnected = false;
  voiceSubscription?: Subscription;
  activePeersSubscription?: Subscription;

  volumeForm!: FormGroup;

  private _userId?: string;
  set userId(value: string) {
    this._userId = value;
  }
  get userId(): string {
    return this._userId!;
  }

  constructor(private fb: FormBuilder, private authService: AuthService, private voiceService: VoiceService) { }

  async ngOnInit() {
    this.initForm();
    const user = await firstValueFrom(this.authService.currentUser.pipe(take(1)))
    this.userId = user?.uid!;
    this.voiceSubscription = this.voiceService.audioLevel.subscribe(({ peerId, level }) => {
      if (peerId === this.player.id) {
        this.isSpeaking = level > 10;
      }
    });
    this.activePeersSubscription = this.voiceService.activePeers.subscribe(peers => {
      this.isConnected = peers.includes(this.player.id);
    });
  }

  ngOnDestroy() {
    this.voiceSubscription?.unsubscribe();
    this.activePeersSubscription?.unsubscribe();
  }

  initForm() {
    const savedVolume = localStorage.getItem(`volume_${this.player.id}`);
    this.volumeForm = this.fb.group({
      volume: [savedVolume ? parseFloat(savedVolume) : 0.5]
    });
    this.volumeForm.get('volume')?.valueChanges.subscribe(value => {
      localStorage.setItem(`volume_${this.player.id}`, value.toString());
      this.setVolume();
    });
  }

  toggleCharacter() {
    this.showCharacter = !this.showCharacter;
  }

  kickPlayer() {
    if (this.role === PlayerRole.HOST)
      this.kickPlayerEvent.emit(this.player.id);
  }
  toggleVolumeSetting() {
    this.volumeSettingsVisible = !this.volumeSettingsVisible;
  }
  setVolume() {
    const volume = this.volumeForm.get('volume')?.value;
    this.volumeEvent.emit({ id: this.player.id, value: volume });
  }
}
