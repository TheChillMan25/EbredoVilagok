import { Component, ViewChild } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { setBackground } from '../../shared/functional/functions';
import { NgClass } from '@angular/common';
import { MapContainerComponent } from '../../shared/functional/map-container/map-container.component';
import { Location } from '../../shared/models/map_locations';

interface Marker {
  id: string;
  text: string;
}

interface SearchResult {
  id: string;
  name: string;
  location: number;
}

@Component({
  selector: 'app-map',
  imports: [
    MatFormField,
    MatLabel,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    NgClass,
    MapContainerComponent,
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent {
  @ViewChild(MapContainerComponent) map!: MapContainerComponent;
  search: FormControl = new FormControl();
  controlVisible: boolean = false;

  markerToggles: Marker[] = [
    { id: 'cities', text: 'Városok  ' },
    { id: 'towns', text: 'Falvak' },
    { id: 'waters', text: 'Vízek' },
    { id: 'hills', text: 'Dombok' },
    { id: 'mountains', text: 'Hegyek' },
    { id: 'forests', text: 'Erdők' },
    { id: 'others', text: 'Egyéb' },
    { id: 'all', text: 'Minden' },
  ];

  searchResults: Location[] = [];

  ngOnInit() {
    setBackground('table.jpg');

    this.search.valueChanges.subscribe((value) => {
      this.searchFor(value);
    });
  }

  toggleControlPanel() {
    this.controlVisible = !this.controlVisible;
  }

  hideControlPanel() {
    this.controlVisible = false;
  }

  toggleMarkers(which: string) {
    if (which !== 'all') this.map.toggleMarkers(which);
    else this.map.toggleAllMarkers();
  }

  searchFor(what: string) {
    this.searchResults = [];
    if (what && what.length !== 0) {
      Object.values(this.map.locationsMap).forEach((l) => {
        for (let loc of l.values()) {
          if (
            loc.name.toLocaleLowerCase().includes(what.toLowerCase()) ||
            loc.desc.toLocaleLowerCase().includes(what.toLowerCase())
          )
            this.searchResults.push(loc);
        }
      });
    }
    this.searchResults.sort((a, b) => a.name.localeCompare(b.name));
  }

  locate(location: Location) {
    this.map.locatePoint(location);
  }
}
