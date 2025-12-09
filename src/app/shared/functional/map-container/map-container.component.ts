import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as L from 'leaflet';
import {
  cityLocations,
  forestLocations,
  hillLocations,
  Location,
  LocationIconType,
  mountainLocations,
  otherLocations,
  townLocations,
  trackPath,
  waterLocations,
} from '../../models/map_locations';

@Component({
  selector: 'app-map-container',
  imports: [],
  templateUrl: './map-container.component.html',
  styleUrl: './map-container.component.scss',
})
export class MapContainerComponent {
  @Input() canSelect!: boolean;
  @Output() selectedLocation = new EventEmitter<string>();
  iconUrl: string = 'assets/map/markers/';
  iconSize: L.PointTuple = [48, 48];
  iconAnchor: L.PointTuple = [24, 24];
  shadowSize: L.PointTuple = [0, 0];
  mapType!: string;

  mapOverlay!: L.ImageOverlay;

  map!: L.Map;

  locationsMap: Record<string, Location[]> = {
    cities: cityLocations,
    towns: townLocations,
    waters: waterLocations,
    hills: hillLocations,
    mountains: mountainLocations,
    forests: forestLocations,
    others: otherLocations,
  };

  icons: L.Icon[] = [];

  cities: L.LayerGroup = L.layerGroup();
  towns: L.LayerGroup = L.layerGroup();
  waters: L.LayerGroup = L.layerGroup();
  hills: L.LayerGroup = L.layerGroup();
  mountains: L.LayerGroup = L.layerGroup();
  forests: L.LayerGroup = L.layerGroup();
  others: L.LayerGroup = L.layerGroup();

  markerReference: Map<string, L.Marker> = new Map();

  overlayMap: Record<string, L.LayerGroup> = {
    cities: this.cities,
    towns: this.towns,
    waters: this.waters,
    hills: this.hills,
    mountains: this.mountains,
    forests: this.forests,
    others: this.others,
  };

  ngAfterViewInit() {
    const imageHeight = 3320;
    const imageWidth = 5902;

    const bounds: L.LatLngBoundsExpression = [
      [0, 0],
      [imageHeight, imageWidth],
    ];
    this.map = L.map('map-container', {
      crs: L.CRS.Simple,
      minZoom: -1.75,
      maxZoom: 1,
      zoomSnap: 0.25,
      zoom: 0,
      center: [imageHeight / 2, imageWidth / 2],
      maxBounds: bounds,
      maxBoundsViscosity: 1.0,
    });

    this.initIcons();

    Object.keys(this.locationsMap).forEach((key) => {
      this.createMarkers(this.locationsMap[key], this.overlayMap[key]);
    });

    this.createTrainTrack();

    try {
      this.mapType = localStorage.getItem('mapType') ?? 'general';
    } catch (error) {
      console.warn('Nincsen előre betölthető overlay!');
    }

    this.mapOverlay = L.imageOverlay(`assets/map/${this.mapType}.webp`, bounds);
    this.mapOverlay.addTo(this.map);

    if (this.mapType !== 'general') this.controlMarkers();

    this.map.on('click', (e) => {
      console.log('[' + e.latlng.lat + ', ' + e.latlng.lng + '],');
    });
    this.map.fitBounds(bounds);
  }

  initIcons() {
    this.icons[LocationIconType.City] = new L.Icon({
      iconUrl: this.iconUrl + 'city.svg',
      iconSize: this.iconSize,
      iconAnchor: this.iconAnchor,
      shadowSize: this.shadowSize,
    });
    this.icons[LocationIconType.Town] = new L.Icon({
      iconUrl: this.iconUrl + 'town.svg',
      iconSize: this.iconSize,
      iconAnchor: this.iconAnchor,
      shadowSize: this.shadowSize,
    });
    this.icons[LocationIconType.Water] = new L.Icon({
      iconUrl: this.iconUrl + 'water.svg',
      iconSize: this.iconSize,
      iconAnchor: this.iconAnchor,
      shadowSize: this.shadowSize,
    });
    this.icons[LocationIconType.Hill] = new L.Icon({
      iconUrl: this.iconUrl + 'hill.svg',
      iconSize: this.iconSize,
      iconAnchor: this.iconAnchor,
      shadowSize: this.shadowSize,
    });
    this.icons[LocationIconType.Mountain] = new L.Icon({
      iconUrl: this.iconUrl + 'mountain.svg',
      iconSize: this.iconSize,
      iconAnchor: this.iconAnchor,
      shadowSize: this.shadowSize,
    });
    this.icons[LocationIconType.Forest] = new L.Icon({
      iconUrl: this.iconUrl + 'forest.svg',
      iconSize: this.iconSize,
      iconAnchor: this.iconAnchor,
      shadowSize: this.shadowSize,
    });
    this.icons[LocationIconType.Other] = new L.Icon({
      iconUrl: this.iconUrl + 'other.svg',
      iconSize: this.iconSize,
      iconAnchor: this.iconAnchor,
      shadowSize: this.shadowSize,
    });
  }

  createMarkers(locations: Location[], markers: L.LayerGroup) {
    for (let loc of locations) {
      let popupTitle: string = loc.name;
      let popupText: string = loc.desc;
      let popupTemplate: string = `
        <div class="popup-title">${popupTitle}</div>
        <hr>
        <div class="popup-text">${popupText}</div>`;

      let marker = L.marker([loc.location.y, loc.location.x], {
        icon: this.icons[loc.type],
      }).bindPopup(popupTemplate, { className: 'custom-popup' });
      if (this.canSelect)
        marker.on('click', () => {
          this.selectLocation(loc.name);
        });
      this.markerReference.set(loc.id, marker);
      markers.addLayer(marker);
    }
    this.map.addLayer(markers);
  }

  createTrainTrack() {
    L.polyline(trackPath, {
      color: 'transparent',
      weight: 10,
    })
      .bindPopup(
        `
        <div class="popup-title">Vasút</div>
        <hr>
        <div class="popup-text">Leírás</div>`,
        { className: 'custom-popup' }
      )
      .addTo(this.map);
  }

  toggleMarkers(which: string, custom: boolean | null = null) {
    const layer = this.overlayMap[which];
    if (!layer) return;

    if (custom !== null) {
      if (this.map.hasLayer(layer) === custom) {
        return;
      }
      if (!custom && this.map.hasLayer(layer)) {
        this.map.removeLayer(layer);
      } else if (custom && !this.map.hasLayer(layer)) {
        this.map.addLayer(layer);
      }
    } else {
      if (this.map.hasLayer(layer)) {
        this.map.removeLayer(layer);
      } else {
        this.map.addLayer(layer);
      }
    }
    this.controlMarkers();
  }

  toggleAllMarkers(show: boolean | null = null) {
    for (let key of Object.keys(this.overlayMap)) {
      this.toggleMarkers(key, show);
    }
  }

  locatePoint(location: Location) {
    this.map.flyTo([location.location.y, location.location.x], 1);
    let marker = this.markerReference.get(location.id);
    console.log(marker);
    marker?.openPopup();
  }

  selectLocation(location: string) {
    if (parent) this.selectedLocation.emit(location);
  }

  changeMap(isAradas: boolean) {
    this.mapType = isAradas ? 'aradas' : 'general';
    localStorage.setItem('mapType', this.mapType);
    this.mapOverlay.setUrl(`assets/map/${this.mapType}.webp`);
    this.controlMarkers();
  }

  controlMarkers() {
    Object.values(this.locationsMap).forEach((values) => {
      values.forEach((location) => {
        let marker = this.markerReference.get(location.id);
        if (marker) {
          var element = marker.getElement();
        }
        if (location.map !== this.mapType && location.map !== 'both') {
          if (element) {
            element.classList.add('hidden-marker');
          }
        } else {
          if (element) {
            element.classList.remove('hidden-marker');
          }
        }
      });
    });
  }
}
