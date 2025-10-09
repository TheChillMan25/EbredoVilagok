import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

export interface Card {
  name: string;
  img: string;
  id: string;
}

@Component({
  selector: 'app-card-container',
  imports: [RouterLink],
  templateUrl: './card-container.component.html',
  styleUrl: './card-container.component.scss',
})
export class CardContainerComponent {
  @Input() cards: { name: string; img: string; id: string }[] = [];
  @Input() size!: 'small' | 'large';
  @Input() action!: (path: string) => void;
  constructor(private router: Router) {}
  triggerAction(path: string) {
    if (this.action) {
      this.action(path);
    }
  }
}
