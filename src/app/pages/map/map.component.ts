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
  show: boolean;
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
        console.log(marker);
      });
    }
  }

  searchFor(what: string) {
    if (what && what.length !== 0) {
      this.searchResults = [];
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
    if (this.isMobileView()) this.hideControlPanel();
  }

  isMobileView(): boolean {
    return window.innerWidth <= 768;
  }
}
