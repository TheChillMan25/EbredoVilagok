import { Component, EventEmitter, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-small-screen',
  imports: [MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './small-screen.component.html',
  styleUrl: './small-screen.component.scss'
})
export class SmallScreenComponent {
  @Output() goBackToIndexEvent = new EventEmitter<void>();

  emitEvent(){
    this.goBackToIndexEvent.emit();
  }
}
