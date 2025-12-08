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

    L.imageOverlay('assets/map/big_map.webp', bounds).addTo(this.map);

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
        [1817, 2050.107643020595],
        [1769.5, 2071.103157894737],
        [1747, 2092.5985659801677],
        [1739.5, 2129.0907704042716],
        [1760, 2205.0745385202135],
        [1781.5, 2276.0593745232645],
        [1810, 2364.040579710145],
        [1826, 2424.027765064836],
        [1869, 2548.50117467582],
        [1896, 2632.4832341723877],
        [1931, 2684.972021357742],
        [1965, 2714.4657208237986],
        [1981.5, 2744.459313501144],
        [1998.5, 2801.9470327993895],
        [2000.5, 2820.9470327993895],
        [1998.5, 2852.9361403508774],
        [1976.5, 2925.4206559877957],
        [1967.5, 2962.9126468344775],
        [1970, 3035.897055682685],
        [1966, 3074.388832951945],
        [1949, 3115.3800762776505],
        [1911, 3176.36704805492],
        [1861.5, 3272.3465446224254],
        [1836.5, 3323.835545385202],
        [1764, 3426.813546910755],
        [1721.5, 3546.7879176201373],
        [1694, 3620.772112890923],
        [1669.5, 3685.758230358505],
        [1663, 3731.7484057971014],
        [1673.5, 3804.732814645309],
        [1688.5, 3845.2241647597257],
        [1704, 3889.2147673531654],
        [1738, 3951.201525553013],
        [1750, 3983.194691075515],
        [1751, 4004.690099160946],
        [1762, 4026.6854004576658],
        [1790, 4044.181662852784],
        [1803, 4049.680488176964],
        [1830, 4045.680488176964],
        [1872.5, 4022.686254767353],
        [1915.5, 4006.189778794813],
        [1939.5, 3992.192768878718],
        [1964, 3965.6984286803963],
        [1977.5, 3940.2038749046533],
        [1999, 3882.7161556064075],
        [2000.5, 3867.7193592677345],
        [1997, 3830.2273684210527],
        [1999.5, 3810.231639969489],
        [2017.5, 3762.7417848970254],
        [2025, 3744.745629290618],
        [2020.5, 3713.252356979405],
        [2007.5, 3671.7612204424104],
        [2011, 3655.2647444698705],
        [2055.5, 3610.274355453852],
        [2101, 3582.2803356216627],
        [2119, 3564.2841800152555],
        [2136.5, 3530.291441647597],
        [2158, 3481.801800152555],
        [2172.5, 3459.8064988558353],
        [2230.5, 3385.3224103737602],
        [2240, 3337.8325553012965],
        [2241.5, 3302.8400305110604],
        [2247, 3277.8453699466054],
        [2265, 3249.8513501144166],
        [2278, 3221.8573302822274],
        [2295, 3165.869290617849],
        [2305, 3141.874416475973],
        [2326, 3118.379435545385],
        [2344.5, 3096.8840274599543],
        [2361.5, 3069.3899008390545],
        [2376.5, 3030.398230358505],
        [2387.5, 2992.906239511823],
        [2398, 2960.4131807780323],
        [2406, 2897.4266361556065],
        [2410.5, 2814.444363081617],
        [2423, 2754.457177726926],
        [2432.5, 2707.4672158657513],
        [2442.5, 2656.978001525553],
        [2492.5, 2507.5099313501146],
        [2505, 2455.02114416476],
        [2518, 2400.5327841342487],
        [2535.5, 2346.544317315027],
        [2535.5, 2318.0504042715484],
        [2524, 2285.0574523264686],
        [2504.5, 2254.572509534706],
        [2487, 2225.07881006865],
        [2446, 2201.0839359267734],
        [2425.5, 2175.519008390542],
        [2400, 2112.532463768116],
        [2378.5, 2048.046239511823],
        [2359.5, 1993.557879481312],
        [2350, 1965.5715484363081],
        [2330, 1929.5715484363081],
        [2290, 1873.0836155606407],
        [2230.5, 1793.1079633867278],
        [2185.5, 1745.6127688787187],
        [2172.5, 1736.6127688787187],
        [2153.5, 1733.0741113653698],
        [2133.5, 1738.1124485125858],
        [2101, 1757.0562776506483],
        [2070.5, 1769.0537147215866],
        [2028.5, 1775.0524332570558],
        [2006, 1783.0507246376812],
        [1974.5, 1805.0460259344013],
        [1940, 1825.5403661327232],
        [1904.5, 1837.5378032036613],
        [1887.5, 1858.5333180778032],
        [1874.5, 1887.5271243325706],
        [1866.5, 1920.0201830663616],
        [1859, 1968.5098245614035],
        [1845, 2013.0003203661327],
        [1824, 2042.9939130434782],
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
}
