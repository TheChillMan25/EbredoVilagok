import { Component } from '@angular/core';
import { Character, User } from '../../shared/models/models';
import { Subscription } from 'rxjs';
import { UserService } from '../../shared/services/user/user.service';
import { setBackground } from '../../shared/functional/functions';
import { KarakterTemplateComponent } from './karakter-template/karakter-template.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [KarakterTemplateComponent, NgClass],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  showCharacter: boolean = true;
  user: User | null = null;
  characters: Character[] = [];
  username: string = '';
  email: string = '';

  isLoading: boolean = false;
  private profileSubscription: Subscription | null = null;

  constructor(private userService: UserService) {}

  ngOnInit() {
    setBackground('bg.jpg');
    this.loadUserProfile();
  }

  ngOnDestroy() {
    if (this.profileSubscription) this.profileSubscription.unsubscribe();
    console.log(this.characters)
  }

  loadUserProfile() {
    this.isLoading = true;
    this.profileSubscription = this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.user = data.user;
        this.characters = data.characters;
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
  }
}
