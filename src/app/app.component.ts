import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { RouterLink } from '@angular/router'; 

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatButtonModule, MatSidenav, MatSidenavModule, MatToolbarModule, MatIconModule, NavbarComponent, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Ebredo_Vilagok';
}
