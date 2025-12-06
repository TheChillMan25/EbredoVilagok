import { Component } from '@angular/core';
import { setBackground } from '../../../shared/functional/functions';

@Component({
  selector: 'app-lands',
  imports: [],
  templateUrl: './lands.component.html',
  styleUrl: './lands.component.scss',
})
export class LandsComponent {
  ngOnInit() {
    setBackground('paper_bg');
  }
}
