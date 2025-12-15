import { Component, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import {
  getSpeciesName,
  setBackground,
  setDisplay,
} from '../../../../shared/functional/functions';
import { species, SpeciesInterface } from '../species_desc_data';

@Component({
  selector: 'app-species-template',
  imports: [],
  templateUrl: './species-template.component.html',
  styleUrl: './species-template.component.scss',
})
export class SpeciesTemplateComponent {
  id!: string | null;
  currentSpecies!: SpeciesInterface[];

  constructor(private route: ActivatedRoute, private title: Title) {}
  ngOnInit() {
    setBackground('paper_bg');
    this.id = this.route.snapshot.paramMap.get('id');
    this.title.setTitle(`Fajok | ${getSpeciesName(this.id)}`);
    if (this.id) {
      this.currentSpecies = species[this.id];
    }
  }

  showProperties(id: string) {
    const element = document.getElementById(`${id}-container`);
    const container = document.getElementById('ui-container');
    if (container) setDisplay(container, 'flex');
    if (element) setDisplay(element, 'flex');
  }

  hideProperties() {
    const elements = document.querySelectorAll('.species-properties-container');
    if (elements) {
      elements.forEach((div) => {
        setDisplay(div as HTMLElement, 'none');
      });
    }
    const container = document.getElementById('ui-container');
    if (container) setDisplay(container, 'none');
  }
}
