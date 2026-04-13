import { Component } from '@angular/core';
import { Adventure, Character, User } from '../../shared/models/models';
import { combineLatest, Subscription } from 'rxjs';
import { UserService } from '../../shared/services/user/user.service';
import { setBackground } from '../../shared/functional/functions';
import { KarakterTemplateComponent } from './karakter-template/karakter-template.component';
import { NgClass } from '@angular/common';
import { KalandTemplateComponent } from './kaland-template/kaland-template.component';
import { CharacterService } from '../../shared/services/character/character.service';
import { AdventureService } from '../../shared/services/adventure/adventure.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [KarakterTemplateComponent, NgClass, KalandTemplateComponent, MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule],
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
  confirmPSW: FormControl = new FormControl('');
  showDeleteUI: boolean = false;

  isLoading: boolean = false;
  private profileSubscription: Subscription | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private userService: UserService,
    private charService: CharacterService,
    private advService: AdventureService,
    private router: Router
  ) { }

  ngOnInit() {
    setBackground('bg');
    this.loadUserProfile();
    try {
      this.showCharacter = localStorage.getItem('visibleContainerOnProfile')
        ? localStorage.getItem('visibleContainerOnProfile') === 'characters'
        : true;
    } catch (error) {
      localStorage.setItem('visibleContainerOnProfile', 'characters');
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
    localStorage.setItem('visibleContainerOnProfile', this.showCharacter ? 'characters' : 'events');
  }

  confirmDeleteUser() {
    const psw = this.confirmPSW.value;
    if (!psw || psw.trim() === '') {
      alert('Add meg a jelszavad a törlés megerősítéséhez!');
      return;
    }
    this.userService.deleteUser(psw).then(() => {
      this.router.navigateByUrl('/index');
    }).catch(err => {
      alert('Hiba a felhasználó törlésekor!');
    })
  }
}
