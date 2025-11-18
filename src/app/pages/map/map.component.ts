import { Component } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { setBackground } from '../../shared/functional/functions';
import { NgClass } from '@angular/common';

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
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent {
  search: FormControl = new FormControl();
  controlVisible: boolean = false;

  markerToggles: Marker[] = [
    { id: 'cities', text: 'Marker' },
    { id: 'cities', text: 'Marker' },
    { id: 'cities', text: 'Marker' },
    { id: 'cities', text: 'Marker' },
    { id: 'cities', text: 'Marker' },
    { id: 'cities', text: 'Marker' },
    { id: 'cities', text: 'Marker' },
    { id: 'cities', text: 'Marker' },
    { id: 'cities', text: 'Marker' },
    { id: 'cities', text: 'Marker' },
  ];

  searchResults: SearchResult[] = [
    {
      id: 'forest',
      name: 'Erdő',
      location: 1,
    },
    {
      id: 'forest',
      name: 'Erdő',
      location: 1,
    },
    {
      id: 'forest',
      name: 'Erdő',
      location: 1,
    },
  ];

  ngOnInit() {
    setBackground('table.jpg');
  }

  toggleControlPanel() {
    this.controlVisible = !this.controlVisible;
  }

  hideControlPanel() {
    this.controlVisible = false;
  }
}
