import { Component } from '@angular/core';
import { Character, User } from '../../shared/models/models';
import { Subscription } from 'rxjs';
import { UserService } from '../../shared/services/user/user.service';
import { setBackground } from '../../shared/functional/functions';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  user: User | null = null;
  characters: Character[] = [];
  username: string = '';
  email: string = '';

  isLoading: boolean = false;
  private profileSubscription: Subscription | null = null;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUserProfile();
    setBackground('bg.jpg');
  }

  ngOnDestroy() {
    if (this.profileSubscription) this.profileSubscription.unsubscribe();
  }

  loadUserProfile() {
    this.isLoading = true;
    this.profileSubscription = this.userService.getUserProfile().subscribe({
      next: (data) => {
        (this.user = data.user),
          (this.username = data.username),
          (this.email = data.email);
        this.isLoading = false;
      },
      error(err) {
        console.error('Hiba a profil betöltésekor: ' + err);
      },
    });
  }
}
