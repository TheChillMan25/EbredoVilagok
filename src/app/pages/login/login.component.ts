import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { setBackground } from '../../shared/functional/functions';

@Component({
  selector: 'app-login',
  imports: [
    MatProgressSpinnerModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email = new FormControl();
  password = new FormControl();
  isLoading: boolean = false;
  loginError: string = '';
  showLoginForm: boolean = true;
  authSubscription?: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(){
    setBackground('bg')
  }

  login() {
    if (this.email.invalid) {
      this.loginError = 'Hibás email cím!';
    }

    if (this.password.invalid) {
      this.loginError = 'Hibás jelszó!';
    }

    const emailVal = this.email.value || '';
    const pswVal = this.password.value || '';

    this.showLoginForm = false;
    this.isLoading = true;
    this.loginError = '';

    this.authService
      .signIn(emailVal, pswVal)
      .then(() => {
        this.authService.updateLoginStatus(true);
        this.router.navigateByUrl('/index');
      })
      .catch((error) => {
        console.error('Bejelentkezési hiba: ' + error);
        this.isLoading = false;
        this.showLoginForm = true;

        switch (error.code) {
          case 'auth/user-not-found':
            this.loginError = 'Nem található felhasználó ezzel az email címmel';
            break;
          case 'auth/wrong-password':
            this.loginError = 'Hibás jelszó';
            break;
          case 'auth/invalid-credential':
            this.loginError = 'Hibás email cím vagy jelszó';
            break;
          default:
            this.loginError = 'Ismeretlen hiba történt a bejelentkezés során';
        }
      });
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
  }
}
