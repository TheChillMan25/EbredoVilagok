import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { setBackground } from '../functional/functions';

@Component({
  selector: 'app-pagenotfound',
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule],
  templateUrl: './pagenotfound.component.html',
  styleUrl: './pagenotfound.component.scss',
})
export class PagenotfoundComponent {
  ngOnInit() {
    setBackground('#222', true);
  }
}
