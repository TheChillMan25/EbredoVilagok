import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  Adventure,
  Character,
  Game,
  Player,
  PlayerStatus,
} from '../../shared/models/models';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { AdventureService } from '../../shared/services/adventure/adventure.service';
import { CharacterService } from '../../shared/services/character/character.service';
import {
  PlayerRole,
  GameService,
} from '../../shared/services/game/game.service';
import { noWhitespaceValidator } from '../forum/post-template/post-template.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { setBackground } from '../../shared/functional/functions';
import { Router, RouterOutlet } from '@angular/router';
import { GameTemplateComponent } from './templates/game-template/game-template.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-game',
  imports: [
    GameTemplateComponent,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    RouterOutlet,
    MatCheckboxModule,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  isLoading = false;
  currentGame!: string;
  currentPlayer!: Omit<Player, 'userId' | 'username'> | null;

  createError = '';
  continueError = '';
  joinError = '';

  fb = new FormBuilder();
  newGameForm!: FormGroup;
  continueGameForm!: FormGroup;
  joinGameForm!: FormGroup;

  myCharacters: Character[] = [];
  myAdventures: Adventure[] = [];
  myGames: Game[] = [];
  openGames: Game[] = [];

  subscriptions: Subscription[] = [];

  constructor(
    private gameService: GameService,
    private advService: AdventureService,
    private charService: CharacterService,
    private router: Router
  ) {}

  ngOnInit() {
    setBackground('#222', true);
    this.initForms();
    this.loadData();
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0)
      this.subscriptions.forEach((s) => s.unsubscribe());
  }

  loadData() {
    this.subscriptions.push(
      this.charService.getAllCharacters().subscribe((value) => {
        this.myCharacters = value;
      })
    );
    this.subscriptions.push(
      this.advService.getAllAdventures().subscribe((value) => {
        this.myAdventures = value;
      })
    );
    this.subscriptions.push(
      this.gameService.getMyGames().subscribe((value) => {
        this.myGames = value;
      })
    );
    this.subscriptions.push(
      this.gameService.getOpenPublicGames().subscribe((value) => {
        this.openGames = value;
      })
    );
  }

  initForms() {
    this.newGameForm = this.fb.group({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        noWhitespaceValidator,
      ]),
      adventure: new FormControl('', [Validators.required]),
      maxPlayers: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(6),
      ]),
      isPublic: new FormControl(false, [Validators.required]),
    });
    this.continueGameForm = this.fb.group({
      game: new FormControl('', [Validators.required]),
    });
    this.joinGameForm = this.fb.group({
      joinID: new FormControl('', [Validators.required, noWhitespaceValidator]),
      character: new FormControl('', Validators.required),
    });
  }

  async createGame() {
    try {
      this.createError = '';
      if (this.newGameForm.invalid) {
        this.createError = 'Töltsd ki a kötelező mezőket!';
        return;
      }
      this.isLoading = true;
      const newGameValue = this.newGameForm.value;
      const newGame: Omit<Game, 'id' | 'ownerId' | 'ownerName'> = {
        name: newGameValue.name || '',
        adventure: this.myAdventures.find(
          (a) => a.id === newGameValue.adventure
        ),
        maxPlayers: newGameValue.maxPlayers || 1,
        isPublic: newGameValue.isPublic || false,
        currentPlayer: '',
        currentEvent: 0,
        players: [],
        isOpen: false,
        started: false,
        isCamping: false,
      };
      await this.gameService.createGame(newGame);

      this.newGameForm.reset({
        name: '',
        adventure: '',
        maxPlayers: '',
      });
      this.isLoading = false;
      this.createError = 'A játék sikeresen létrehozva!';
    } catch (error) {
      this.isLoading = false;
      console.error('Hiba a játék létrehozásakor: ', error);
      this.createError = 'Hiba a játék létrehozásakor!';
      return;
    }
  }

  controlGameEvent(value: { type: 'myGame' | 'general'; gameId: string }) {
    switch (value.type) {
      case 'myGame':
        this.loadGame(value.gameId);
        break;
      case 'general':
        this.joinGame(value.gameId);
        break;
      default:
        console.warn('Nem lehet csatlakozni');
    }
  }

  async loadGame(id: string) {
    try {
      let g = await this.gameService.updateGame(id, { isOpen: true });
      if (g) {
        this.isLoading = false;
        this.gameService.PlayerRole = PlayerRole.HOST;
        this.router.navigate(['/jatek', id, 'lobby']);
      }
    } catch (error) {
      this.isLoading = false;
      console.error('Hiba a játék betöltésekor: ', error);
      this.continueError = 'Hiba a játék betöltésekor!';
      return;
    }
  }

  async joinGame(id: string | null = null) {
    try {
      const characterId = this.joinGameForm.get('character')?.value;
      if (!characterId) {
        this.joinError = 'Válassz egy karaktert a csatlakozáshoz!';
        return;
      }

      if (id === null && this.joinGameForm.invalid) {
        this.joinError = 'Töltsd ki a kötelező mezőket!';
        return;
      }
      this.isLoading = true;
      const game = id ? id : this.joinGameForm.get('joinID')?.value;
      const selectedCharacter = this.myCharacters.find(
        (c) => c.id === characterId
      );
      if (!selectedCharacter) {
        this.isLoading = false;
        this.joinError = 'A kiválasztott karakter nem található!';
        return;
      }

      const player: Omit<Player, 'userId' | 'username'> = {
        character: selectedCharacter,
        currentAction: '',
        status: PlayerStatus.NOTREADY,
        initiative: null
      };

      let g = await this.gameService.joinGame(game, player);
      if (g) {
        this.isLoading = false;
        this.gameService.PlayerRole = PlayerRole.PLAYER;
        this.router.navigate(['/jatek', game, 'lobby']);
      }
    } catch (error) {
      this.isLoading = false;
      console.error('Hiba a játékhoz csatlakozáskor: ', error);
      this.joinError = 'Nem sikerült csatlakozni!';
      return;
    }
  }
}
