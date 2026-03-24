import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import {
  getSpeciesName,
  setBackground,
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
  propertiesVisible: boolean = false;
  currentSpeciesGroup!: SpeciesInterface[];
  currentSpecies?: SpeciesInterface;
  constructor(private route: ActivatedRoute, private title: Title) { }
  ngOnInit() {
    setBackground('paper_bg');
    this.id = this.route.snapshot.paramMap.get('id');
    this.title.setTitle(`Fajok | ${getSpeciesName(this.id)}`);
    if (this.id) {
      this.currentSpeciesGroup = species[this.id];
    }
  }

  showProperties(id: string) {
    console.log(id);
    this.currentSpecies = this.currentSpeciesGroup.find((s) => s.id === id) as SpeciesInterface;
    this.propertiesVisible = true;
    /* const element = document.getElementById(`${id}-container`);
    const container = document.getElementById('ui-container');
    if (container) setDisplay(container, 'flex');
    if (element) setDisplay(element, 'flex'); */
  }

  hideProperties() {
    this.currentSpecies = undefined;
    this.propertiesVisible = false;
  }
}
