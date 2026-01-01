import { Component } from '@angular/core';
import { Adventure, Character, User } from '../../shared/models/models';
import {
  combineLatest,
  Subscription,
} from 'rxjs';
import { UserService } from '../../shared/services/user/user.service';
import { setBackground } from '../../shared/functional/functions';
import { KarakterTemplateComponent } from './karakter-template/karakter-template.component';
import { NgClass } from '@angular/common';
import { KalandTemplateComponent } from './kaland-template/kaland-template.component';
import { CharacterService } from '../../shared/services/character/character.service';
import { AdventureService } from '../../shared/services/adventure/adventure.service';

@Component({
  selector: 'app-profile',
  imports: [KarakterTemplateComponent, NgClass, KalandTemplateComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  showCharacter!: boolean;
  user: User | null = null;
  characters: Character[] = [];
  adventures: Adventure[] = [];
  username: string = '';
  email: string = '';

  isLoading: boolean = false;
  private profileSubscription: Subscription | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private userService: UserService,
    private charService: CharacterService,
    private advService: AdventureService
  ) {}

  ngOnInit() {
    setBackground('bg');
    this.loadUserProfile();
    try {
      this.showCharacter = localStorage.getItem('showCharacter') === 'true';
    } catch (error) {
      localStorage.setItem('showCharacter', 'true');
      this.showCharacter = true;
      console.error(error);
    }
    this.loadCharAdvData();
  }

  ngOnDestroy() {
    if (this.profileSubscription) this.profileSubscription.unsubscribe();
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  loadUserProfile() {
    this.isLoading = true;
    this.profileSubscription = this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.user = data.user;
        this.username = data.username;
        this.email = data.email;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Hiba a profil betöltésekor: ' + err);
        this.isLoading = false;
      },
    });
  }

  loadCharAdvData() {
    const characters$ = this.charService.getAllCharacters();
    const adventures$ = this.advService.getAllAdventures();
    const combined$ = combineLatest([characters$, adventures$]);
    const subscription = combined$.subscribe({
      next: ([characters, adventures]) => {
        this.characters = characters;
        this.adventures = adventures;
      },
      error: (err) => {
        console.error('Hiba a karakterek betöltésekor: ', err);
      },
    });
    this.subscriptions.push(subscription);
  }

  showContainer(container: string = '') {
    if (container === 'character') this.showCharacter = true;
    else this.showCharacter = false;
    localStorage.setItem('showCharacter', this.showCharacter.toString());
  }
}
