import { Component } from '@angular/core';
import { Adventure, Character, User } from '../../shared/models/models';
import { Subscription } from 'rxjs';
import { UserService } from '../../shared/services/user/user.service';
import { setBackground } from '../../shared/functional/functions';
import { KarakterTemplateComponent } from './karakter-template/karakter-template.component';
import { NgClass } from '@angular/common';
import { KalandTemplateComponent } from './kaland-template/kaland-template.component';

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

  constructor(private userService: UserService) {}

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
  }

  ngOnDestroy() {
    if (this.profileSubscription) this.profileSubscription.unsubscribe();
    console.log(this.characters);
  }

  loadUserProfile() {
    this.isLoading = true;
    this.profileSubscription = this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.user = data.user;
        this.characters = data.characters;
        this.adventures = data.adventures;
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

  showContainer(container: string = '') {
    if (container === 'character') this.showCharacter = true;
    else this.showCharacter = false;
    localStorage.setItem('showCharacter', this.showCharacter.toString());
  }
}
