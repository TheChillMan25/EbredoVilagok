import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card-container',
  imports: [RouterLink],
  templateUrl: './card-container.component.html',
  styleUrl: './card-container.component.scss'
})
export class CardContainerComponent {

  @Input() cards: { name: string; img: string; id: string}[] = [];
  @Input() size!: 'small' | 'large';
}
