import { Component, Input } from '@angular/core';
import { Character } from '../../../shared/models/models';
import {
  getHome,
  getSpeciesSpecial,
} from '../../../shared/functional/functions';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-karakter-template',
  imports: [NgClass],
  templateUrl: './karakter-template.component.html',
  styleUrl: './karakter-template.component.scss',
})
export class KarakterTemplateComponent {
  @Input() character?: Character;
  showSpecDescs: boolean = false;

  speciesSpecial!: { desc: string };
  home!: { desc: string; bonus: { name: string; mod: string }[] };

  stats: { name: string; value: string }[] = [];
  mainStats: { name: string; value: number }[] = [];

  ngOnInit() {
    this.createStats();
    this.home = getHome(
      this.character?.species,
      this.character?.specialProperties.home
    );
    this.speciesSpecial = getSpeciesSpecial(
      this.character?.species,
      this.character?.specialProperties.speciesProperty
    );
  }

  createStats() {
    if (this.character) {
      this.stats.push({
        name: 'Erő',
        value: this.convertStatNumToString(this.character.stats.physical.ero),
      });
      this.stats.push({
        name: 'Ügyesség',
        value: this.convertStatNumToString(
          this.character.stats.physical.ugyesseg
        ),
      });
      this.stats.push({
        name: 'Kitartás',
        value: this.convertStatNumToString(
          this.character.stats.physical.kitartas
        ),
      });
      this.stats.push({
        name: 'Ész',
        value: this.convertStatNumToString(this.character.stats.mental.esz),
      });
      this.stats.push({
        name: 'Fortély',
        value: this.convertStatNumToString(this.character.stats.mental.fortely),
      });
      this.stats.push({
        name: 'Akaraterő',
        value: this.convertStatNumToString(
          this.character.stats.mental.akaratero
        ),
      });
      this.mainStats.push({
        name: 'HP',
        value: this.character.stats.main.hp,
      });
      this.mainStats.push({
        name: 'SP',
        value: this.character.stats.main.sp,
      });
    }
  }

  convertStatNumToString(value: number) {
    return value > 0 ? '+' + value : `${value}`;
  }

  showSpecielDescs(which: 'home' | 'special') {
    this.showSpecDescs = true;
    let container;
    if (this.character?.id)
      container = document.getElementById(this.character?.id);
    if (container) {
      if (which === 'home') {
        container.textContent = this.home.desc;
      } else {
        container.textContent = this.speciesSpecial.desc;
      }
    }
    console.log(this.home.desc, this.speciesSpecial.desc);
  }

  hideSpecDescs() {
    this.showSpecDescs = false;
  }
}
