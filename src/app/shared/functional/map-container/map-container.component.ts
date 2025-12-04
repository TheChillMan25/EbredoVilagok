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
    const imageHeight = 2160;
    const imageWidth = 3840;

    const bounds: L.LatLngBoundsExpression = [
      [0, 0],
      [imageHeight, imageWidth],
    ];
    this.map = L.map('map-container', {
      crs: L.CRS.Simple,
      minZoom: -1,
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

    L.imageOverlay('assets/map/map.jpg', bounds).addTo(this.map);

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
    let trainTrack = L.polyline(
      [
        [1255, 1000],
        [1230, 1020],
        [1200, 1025],
        [1180, 1040],
        [1165, 1075],
        [1175, 1145],
        [1190, 1200],
        [1260, 1400],
        [1280, 1575],
        [1300, 1610],
        [1330, 1625],
        [1360, 1640],
        [1400, 1675],
        [1415, 1715],
        [1400, 1900],
        [1395, 2000],
        [1365, 2100],
        [1330, 2160],
        [1300, 2200],
        [1255, 2280],
        [1180, 2400],
        [1130, 2500],
        [1085, 2720],
        [1100, 2800],
        [1125, 2860],
        [1160, 2915],
        [1175, 2985],
        [1215, 3020],
        [1230, 3023],
        [1270, 3010],
        [1325, 2980],
        [1370, 2913],
        [1430, 2855],
        [1430, 2780],
        [1440, 2730],
        [1435, 2670],
        [1430, 2650],
        [1420, 2615],
        [1430, 2590],
        [1520, 2563],
        [1570, 2500],
        [1630, 2400],
        [1713, 2130],
        [1740, 2085],
        [1792, 2010],
        [1815, 1950],
        [1833, 1850],
        [1825, 1750],
        [1860, 1650],
        [1870, 1600],
        [1910, 1450],
        [1955, 1370],
        [1951, 1320],
        [1940, 1270],
        [1911, 1210],
        [1906, 1192],
        [1867, 1171],
        [1838, 1128],
        [1775, 950],
        [1717, 848],
        [1627, 724],
        [1595, 704],
        [1560, 707],
        [1521, 724],
        [1462, 733],
        [1403, 778],
        [1358, 797],
        [1311, 817],
        [1287, 861],
        [1280, 913],
        [1274, 966],
        [1260, 995],
      ],
      {
        color: 'transparent',
        weight: 10,
      }
    )
      .bindPopup(
        `
        <div class="popup-title">Vasút</div>
        <hr>
        <div class="popup-text">Leírás</div>`,
        { className: 'custom-popup' }
      )
      .addTo(this.map);
  }

  toggleMarkers(which: string) {
    const layer = this.overlayMap[which];
    if (!layer) return;

    if (this.map.hasLayer(layer)) {
      this.map.removeLayer(layer);
    } else {
      this.map.addLayer(layer);
    }
  }

  toggleAllMarkers() {
    for (let key of Object.keys(this.overlayMap)) {
      this.toggleMarkers(key);
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
}
