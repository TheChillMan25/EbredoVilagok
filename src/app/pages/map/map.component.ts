import { Component, ViewChild } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { setBackground } from '../../shared/functional/functions';
import { NgClass } from '@angular/common';
import { MapContainerComponent } from '../../shared/functional/map-container/map-container.component';
import { Location } from '../../shared/models/map_locations';
import { MatSlideToggle } from '@angular/material/slide-toggle';

interface Marker {
  id: string;
  text: string;
  show: boolean;
}

interface SearchResult {
  id: string;
  name: string;
  location: number;
}

export function isMobileView(): boolean {
  return window.innerWidth <= 768;
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
    MatSlideToggle,
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent {
  @ViewChild(MapContainerComponent) map!: MapContainerComponent;
  search: FormControl = new FormControl();
  isAradas: FormControl = new FormControl();
  controlVisible: boolean = false;
  showAllMarkers: boolean = true;

  markerToggles: Marker[] = [
    { id: 'cities', text: 'Városok', show: true },
    { id: 'towns', text: 'Falvak', show: true },
    { id: 'waters', text: 'Vízek', show: true },
    { id: 'hills', text: 'Dombok', show: true },
    { id: 'mountains', text: 'Hegyek', show: true },
    { id: 'forests', text: 'Erdők', show: true },
    { id: 'others', text: 'Egyéb', show: true },
    { id: 'all', text: 'Minden', show: true },
  ];

  searchResults: Location[] = [];

  ngOnInit() {
    setBackground('table');

    this.search.valueChanges.subscribe((value) => {
      this.searchFor(value);
    });

    try {
      this.isAradas.setValue(localStorage.getItem('mapType') === 'aradas');
    } catch (error) {
      console.warn('valami');
    }
    this.isAradas.valueChanges.subscribe((value) => {
      this.changeMap(value);
    });
  }

  toggleControlPanel() {
    this.controlVisible = !this.controlVisible;
  }

  hideControlPanel() {
    this.controlVisible = false;
  }

  toggleMarkers(which: string) {
    if (which !== 'all') {
      this.map.toggleMarkers(which);
      let marker = this.markerToggles.find((e) => e.id === which);
      if (marker) {
        marker.show = !marker.show;
      }
    } else {
      this.showAllMarkers = !this.showAllMarkers;
      this.map.toggleAllMarkers(this.showAllMarkers);
      this.markerToggles.forEach((marker) => {
        marker.show = this.showAllMarkers;
      });
    }
    this.searchFor(this.search.value);
  }

  searchFor(what: string) {
    if (what && what.length !== 0) {
      this.searchResults = [];
      Object.values(this.map.locationsMap).forEach((l) => {
        for (let loc of l.values()) {
          const marker = this.map.markerReference.get(loc.id);
          if (
            (loc.name.toLocaleLowerCase().includes(what.toLowerCase()) ||
              loc.desc.toLocaleLowerCase().includes(what.toLowerCase())) &&
            (this.map.mapType === loc.map || loc.map === 'both') &&
            marker &&
            this.map.map.hasLayer(marker)
          )
            this.searchResults.push(loc);
        }
      });
    }
    this.searchResults.sort((a, b) => a.name.localeCompare(b.name));
  }

  locate(location: Location) {
    this.map.locatePoint(location);
    if (isMobileView()) this.hideControlPanel();
  }

  changeMap(isAradas: boolean) {
    this.map.changeMap(isAradas);
    if (this.search.value !== '' || this.search.value !== null) {
      this.searchFor(this.search.value);
    }
  }
}
