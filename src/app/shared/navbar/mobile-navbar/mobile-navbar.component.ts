import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-mobile-navbar',
  imports: [MatListModule, MatIconModule, RouterLink, NgClass],
  templateUrl: './mobile-navbar.component.html',
  styleUrl: './mobile-navbar.component.scss',
})
export class MobileNavbarComponent {
  @Input() sidenav!: MatSidenav;
  @Input() isLoggedIn: boolean = false;
  @Output() logOutEvent = new EventEmitter<void>();
  isEncOpen = false;
  isGameOpen = false;

  private authSubscription?: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.currentUser.subscribe((user) => {
      this.isLoggedIn = !!user;
      localStorage.setItem('isLoggedIn', this.isLoggedIn ? 'true' : 'false');
    });
  }

  closeMenu() {
    if (this.sidenav) {
      this.sidenav.close();
    }
  }

  toggleOptions(menu: string) {
    switch (menu) {
      case 'enc':
        this.isEncOpen = !this.isEncOpen;
        this.isGameOpen = false;
        break;
      case 'game':
        this.isGameOpen = !this.isGameOpen;
        this.isEncOpen = false;
        break;
      default:
        break;
    }
  }

  logout() {
    this.authService.signOut().then(() => {
      this.logOutEvent.emit();
      this.closeMenu();
    });
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
  }
}
