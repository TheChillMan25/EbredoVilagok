import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatFormFieldModule,
  MatFormFieldControl,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../shared/services/auth/auth.service';
import { setBackground } from '../../shared/functional/functions';

@Component({
  selector: 'app-register',
  imports: [
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  isLoading = false;
  showForm = true;
  registerError = '';

  registerForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    psw: new FormControl('', [Validators.required, Validators.minLength(6)]),
    rePsw: new FormControl('', [Validators.required]),
  });

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(){
    setBackground('bg');
  }

  register() {
    if (!this.registerForm.valid) {
      this.registerError = 'Hibás kitöltés!';
      return;
    }

    const checkPsw = this.registerForm.get('psw')?.value;
    const rePsw = this.registerForm.get('rePsw')?.value;

    if (checkPsw !== rePsw) {
      this.registerError = 'A két jelszó nem egyezik!';
      return;
    }

    this.isLoading = true;
    this.showForm = false;

    const username = this.registerForm.value.username || '';
    const email = this.registerForm.value.email || '';
    const psw = this.registerForm.value.psw || '';

    if (username.length > 16) {
      this.isLoading = false;
      this.showForm = true;
      this.registerError =
        'Használj rövidebb felhasználó nevet. (max 16 karakter)';
      return;
    }

    this.authService
      .register(email, psw, username)
      .then(() => {
        this.authService.updateLoginStatus(true);
        this.router.navigateByUrl('/index');
      })
      .catch((error) => {
        console.error('Hiba a regisztráció során: ', error);
        this.isLoading = false;
        this.showForm = true;

        switch (error.code) {
          case 'auth/email-already-in-use':
            this.registerError = 'Email már foglalt.';
            break;
          case 'auth/invalid-email':
            this.registerError = 'Érvénytelen email.';
            break;
          case 'auth/weak-password':
            this.registerError = 'Gyenge jelszó, legalább 6 karakter.';
            break;
          default:
            this.registerError =
              'Hiba lépett fel regisztráció közben. Próbáld újra később.';
        }
      });
  }
}
