import { Component, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

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

  //constructor(private authService: AuthService){}

  ngOnInit(): void {
    this.isLoggedIn = Boolean(localStorage.getItem('isLoggedIn'));
    console.log(this.isLoggedIn);
  }

  logout(): void {
    this.isLoggedIn = false;
    localStorage.setItem('isLoggedIn', this.isLoggedIn ? 'true' : 'false');
    
  }
}
