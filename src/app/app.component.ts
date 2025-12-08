import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { RouterLink } from '@angular/router';
import { MobileNavbarComponent } from './shared/navbar/mobile-navbar/mobile-navbar.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatButtonModule,
    MatSidenav,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    NavbarComponent,
    RouterLink,
    MobileNavbarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ebredo-vilagok';
  isLoggedIn: boolean = false;

  ngOnInit() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  onToggleSidenav(sidenav: MatSidenav) {
    sidenav.toggle();
  }

  handleLogin(value: boolean) {
    this.isLoggedIn = value;
  }
}
