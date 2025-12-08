import { Component, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [MatIcon, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  isLoggedIn: boolean = false;
  @Output() isLoggedOutEvent = new EventEmitter<boolean>();

  private authSubscription?: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.currentUser.subscribe((user) => {
      this.isLoggedIn = !!user;
      localStorage.setItem('isLoggedIn', this.isLoggedIn ? 'true' : 'false');
    });
  }

  logout(): void {
    this.isLoggedOutEvent.emit(false);
    this.isLoggedIn = false;
    this.authService.signOut();
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }
}
