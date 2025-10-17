import { Component } from '@angular/core';
import { setBackground } from '../../../shared/functional/functions';

@Component({
  selector: 'app-lands',
  imports: [],
  templateUrl: './lands.component.html',
  styleUrl: './lands.component.scss',
})
export class LandsComponent {
  lands: { name: string; desc: string; img: string }[] = [
    { name: 'Folyóköz', desc: '', img: 'folyokoz.jpg' },
    { name: 'Nyugati Toronyvárosok', desc: '', img: 'nyugatitorony.png' },
    { name: 'Kelet Népe', desc: '', img: 'keletnepe.png' },
  ];

  ngOnInit() {
    setBackground('paper_bg.jpg');
  }
}
