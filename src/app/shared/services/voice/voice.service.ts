import { Injectable } from '@angular/core';
import Peer, { MediaConnection } from 'peerjs';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoiceService {
  private peer: Peer | undefined;
  private myMediaStream: MediaStream | undefined;
  public getStream(): MediaStream | undefined {
    return this.myMediaStream;
  }
  private calls: MediaConnection[] = [];

  private audioContext: AudioContext | undefined;

  public isConnected = new BehaviorSubject<boolean>(false);
  public isMuted = new BehaviorSubject<boolean>(false);
  public isDeafened = new BehaviorSubject<boolean>(false);
  public audioLevel = new Subject<{ peerId: string, level: number }>();
  public activePeers = new BehaviorSubject<string[]>([]);

  public hasActiveConnection(): boolean {
    return !!this.peer && !this.peer.disconnected;
  }

  constructor() { }
  async getMicrophone(): Promise<MediaStream> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('A böngésző biztonsági okokból tiltja a mikrofont (vagy nincs csatlakoztatva). Használj HTTPS-t!');
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
      this.myMediaStream = stream;
      return stream;
    } catch (err) {
      console.error('Hiba a mikrofon elérésekor:', err);
      throw err;
    }
  }
  /**
   * Inicializálja a PeerJS kapcsolatot a megadott userId-vel
   * @param userId A felhasználó azonosítója, amivel a PeerJS kapcsolat létrejön
   * @returns 
   */
  initPeer(userId: string) {
    if (this.peer && !this.peer.disconnected && !this.peer.destroyed) {
      console.log('Már van élő Peer kapcsolat, újrainicializálás kihagyva.');
      return;
    }
    if (!this.myMediaStream) {
      console.error('Előbb kérj mikrofon engedélyt!');
      return;
    }
    if (this.calls.some(c => c.peer === userId)) {
      return;
    }

    if (this.peer) {
      this.peer.destroy();
    }

    this.peer = new Peer(userId);
    this.peer.on('open', () => {
      this.isConnected.next(true);
    });

    this.peer.on('error', (err) => {
      console.error('PeerJS hiba:', err);
    });

    this.peer.on('call', (call) => {
      call.answer(this.myMediaStream!);
      this.handleCallStream(call);
    });
  }

  /**
   * 3. LÉPÉS: Másik játékos felhívása
   */
  connectToPeer(peerId: string) {
    if (!this.peer || !this.myMediaStream) {
      console.warn('Nincs inicializálva a Peer vagy a mikrofon');
      return;
    }
    if (this.calls.find(c => c && c.peer === peerId)) {
      return;
    }
    const call = this.peer.call(peerId, this.myMediaStream);
    if (call) {
      this.handleCallStream(call);
    } else {
      console.warn(`Nem sikerült hívást kezdeményezni felé: ${peerId} (A peer.call undefined-et adott vissza)`);
    }
  }

  /**
   * A hívások közös kezelése (Hívó és Hívott oldalon is)
   */
  private handleCallStream(call: MediaConnection) {
    this.calls.push(call);
    call.on('stream', (remoteStream) => {
      this.addAudioElement(remoteStream, call.peer);
      this.monitorAudioLevel(remoteStream, call.peer);
      this.addActivePeer(call.peer);
    });
    call.on('close', () => {
      this.cleanupPeerConnection(call.peer);
    });
    call.on('error', (err) => {
      console.error('Hívás hiba:', err);
      this.cleanupPeerConnection(call.peer);
    });
  }

  private addActivePeer(peerId: string) {
    const currentPeers = this.activePeers.value;
    if (!currentPeers.includes(peerId)) {
      this.activePeers.next([...currentPeers, peerId]);
    }
  }

  /**
   * Saját mikrofon némítása.
   */
  mute() {
    if (this.myMediaStream) {
      const audioTrack = this.myMediaStream.getAudioTracks()[0];
      audioTrack.enabled = false;
      this.isMuted.next(true);
    }
  }

  /**
   * Saját mikrofon némításának feloldása.
   */
  unMute() {
    if (this.myMediaStream) {
      const audioTrack = this.myMediaStream.getAudioTracks()[0];
      audioTrack.enabled = true;
      this.isMuted.next(false);
      if (this.isDeafened.value === true) {
        this.toggleDeafen(false);
      }
    }
  }
  /**
   * A felhasználó némításának ellenőrzése
   * @returns A felhasználó némítva van-e vagy sem
   */
  muted(): boolean {
    return this.isMuted.value;
  }

  deafen() {
    this.toggleDeafen(true);
  }

  unDeafen() {
    this.toggleDeafen(false);
  }

  toggleDeafen(newState: boolean) {
    this.isDeafened.next(newState);
    const audioElements = document.querySelectorAll('audio[id^="audio-"]');

    audioElements.forEach((audio: any) => {
      if (newState) {
        this.mute();
      } else {
        this.unMute();
      }
      audio.muted = newState;
    });
  }

  deafened(): boolean {
    return this.isDeafened.value;
  }

  /**
     * Egy adott játékos hangerejének állítása
     * @param peerId A játékos azonosítója
     * @param volume Hangerő érték 0.0 és 1.0 között
     */
  setPeerVolume(peerId: string, volume: number) {
    const audioElement = document.getElementById(`audio-${peerId}`) as HTMLAudioElement;
    if (audioElement) {
      const safeVolume = Math.max(0, Math.min(1, volume));
      audioElement.volume = safeVolume;
      localStorage.setItem(`volume-${peerId}`, safeVolume.toString());
    } else {
      console.warn(`Nem található audio elem ehhez a felhasználóhoz: ${peerId}`);
    }
  }

  getPeerVolume(peerId: string): number {
    const audioElement = document.getElementById(`audio-${peerId}`) as HTMLAudioElement;
    if (audioElement) {
      return audioElement.volume;
    } else {
      return 0.5;
    }
  }

  /**
   * Teljes takarítás kilépéskor
   */
  destroy() {
    this.myMediaStream?.getTracks().forEach(track => track.stop());
    this.calls.forEach(call => call.close());
    this.calls = [];
    this.peer?.destroy();
    this.peer = undefined;
    this.audioContext?.close();
    this.audioContext = undefined;
    document.querySelectorAll('audio[id^="audio-"]').forEach(el => el.remove());
    this.isConnected.next(false);
    this.isMuted.next(false);
    this.myMediaStream = undefined;
  }

  // --- SEGÉDFÜGGVÉNYEK ---

  private addAudioElement(stream: MediaStream, peerId: string) {
    if (document.getElementById(`audio-${peerId}`)) return;

    const audio = document.createElement('audio');
    audio.id = `audio-${peerId}`;
    audio.srcObject = stream;
    audio.autoplay = true;
    audio.style.display = 'none';
    const savedVolume = localStorage.getItem(`volume-${peerId}`);
    if (savedVolume) {
      audio.volume = parseFloat(savedVolume);
    } else {
      audio.volume = 0.5;
    }
    if (this.isDeafened.value) {
      audio.muted = true;
    }
    document.body.appendChild(audio);
  }

  private cleanupPeerConnection(peerId: string) {
    const audio = document.getElementById(`audio-${peerId}`);
    if (audio) audio.remove();
    this.calls = this.calls.filter(c => c.peer !== peerId);
    const currentPeers = this.activePeers.value.filter(id => id !== peerId);
    this.activePeers.next(currentPeers);
    this.audioLevel.next({ peerId: peerId, level: 0 });
  }
  private monitorAudioLevel(stream: MediaStream, peerId: string) {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
    const source = this.audioContext.createMediaStreamSource(stream);
    const analyzer = this.audioContext.createAnalyser();
    analyzer.fftSize = 512;
    analyzer.smoothingTimeConstant = 0.3;
    source.connect(analyzer);

    const dataArray = new Uint8Array(analyzer.frequencyBinCount);
    const checkVolume = () => {
      if (!this.calls.find(c => c.peer === peerId)) return;

      analyzer.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;

      if (average > 10) {
        this.audioLevel.next({ peerId, level: average });
      } else {
        this.audioLevel.next({ peerId, level: 0 });
      }

      requestAnimationFrame(checkVolume);
    };
    checkVolume();
  }
}