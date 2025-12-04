import { Component } from '@angular/core';
import * as L from 'leaflet';

enum LocationIconType {
  City,
  Town,
  Water,
  Hill,
  Mountain,
  Forest,
  Other,
}

export interface Location {
  id: string;
  name: string;
  desc: string;
  location: { y: number; x: number };
  type: LocationIconType;
}

@Component({
  selector: 'app-map-container',
  imports: [],
  templateUrl: './map-container.component.html',
  styleUrl: './map-container.component.scss',
})
export class MapContainerComponent {
  iconUrl: string = 'assets/map/markers/';
  iconSize: L.PointTuple = [48, 48];
  iconAnchor: L.PointTuple = [24, 24];
  shadowSize: L.PointTuple = [0, 0];

  map!: L.Map;
  cityLocations: Location[] = [
    {
      id: 'den_karadenn',
      name: 'Den Karadenn',
      desc: 'A Nyugat vasökle, a feketét vérző város. Az északi hegységekben található kifogyhatatlan fém és ikor lelőhelyek az ipar igazi felhőkbe tornyosodó óriásává tette ezt a kis népet. A toronyból folyamatosan folyik a használt, fekete ikor és egész mocsarakat alkotott a ragyogást vesztett folyadék. A földterület szűkösségét terraformáló gépekkel, a kevés harcra képes kezet pedig sokszorosan kiegyensúlyozzák pusztító fegyverekkel.',
      location: { y: 1925, x: 1314 },
      type: LocationIconType.City,
    },
    {
      id: 'alpir',
      name: 'Alpir',
      desc: 'Alpir ',
      location: {
        x: 1072,
        y: 1112,
      },
      type: LocationIconType.City,
    },
    {
      id: 'aldol',
      name: 'Aldol',
      desc: 'Aldol',
      location: {
        x: 1262,
        y: 1145,
      },
      type: LocationIconType.City,
    },
    {
      id: 'cha1',
      name: 'Cha1',
      desc: "Cha'me'rén",
      location: {
        x: 855,
        y: 1500,
      },
      type: LocationIconType.City,
    },
    {
      id: 'cha2',
      name: 'Cha2',
      desc: "Cha'me'rén",
      location: {
        x: 905,
        y: 1400,
      },
      type: LocationIconType.City,
    },
    {
      id: 'cha3',
      name: 'Cha3',
      desc: "Cha'me'rén",
      location: {
        x: 665,
        y: 1480,
      },
      type: LocationIconType.City,
    },
    {
      id: 'felba',
      name: 'Felba',
      desc: 'A Határhegyek szomszédságában fekvő, az egyik legnagyobb folyóközi város. Főleg a könnyűipar és a halászat a domináns. Emellett a turisztika is meghatározó ágazat, a kűzdősportok a városi arénákban igen kedveltté tették a környéken. Megtalálható még itt a vasútnak egy megállója is.',
      location: {
        x: 2138,
        y: 1390,
      },
      type: LocationIconType.City,
    },
    {
      id: 'nulina',
      name: 'Nulina',
      desc: 'Folyóköz legtapasztaltabb fa- és vízimérnökei találhatóak meg itt. Nulinában a fának olyan fontos szerepe van, mint másutt az ételnek vagy az italnak, ezért a növényszerzetek nagy szeretettel vannak fogadva. Az idők kezdetén, mielőtt még kővel építkeztek volna, egy egész faerőd állt a város helyén.',
      location: {
        x: 1681,
        y: 1592,
      },
      type: LocationIconType.City,
    },
    {
      id: 'er_armein',
      name: 'Er Armein',
      desc: 'Folyóköz legnagyobb városa. Rendelkezik egy akadémiával, ahol könnyebb lenne felsorolni mit nem tanítanak (szakállnyírást). Aki erre az akadémiára bekerül, az 30%, hogy beleőrül a tanulmányokba, mielőtt még befejezé azokat. A város nyomornegyede a "Gödör" nevet viseli. Aki ide egyszer lekerül, nehezen tud vissza mászni. A város csendőrei nem szívesen teszik be ide a lábukat.',
      location: {
        x: 2185,
        y: 1557,
      },
      type: LocationIconType.City,
    },
    {
      id: 'kelet1',
      name: 'Kelet1',
      desc: 'Leírás',
      location: {
        x: 3245,
        y: 1030,
      },
      type: LocationIconType.City,
    },
    {
      id: 'kelet2',
      name: 'Kelet2',
      desc: 'Leírás',
      location: {
        x: 2650,
        y: 1560,
      },
      type: LocationIconType.City,
    },
    {
      id: 'kelet3',
      name: 'Kelet3',
      desc: 'Leírás',
      location: {
        x: 2855,
        y: 1240,
      },
      type: LocationIconType.City,
    },
  ];
  townLocations: Location[] = [
    {
      id: 'phunor',
      name: 'Phunor',
      desc: 'A folyamokat összekötő csatorna partján található kisváros. Az emberek itt főleg mezőgazdaságból élnek. A település híres arról a gépészműhelyéről, melyben minden gépezet megjavítása lehetséges.',
      location: {
        x: 1922,
        y: 1635,
      },
      type: LocationIconType.Town,
    },
    {
      id: 'harspuszta',
      name: 'Hárspuszta',

      desc: 'Leírás',
      location: {
        x: 1600,
        y: 1495,
      },
      type: LocationIconType.Town,
    },
    {
      id: 'nema_kupola',
      name: 'Néma Kupola',

      desc: 'Leírás',
      location: {
        x: 1476,
        y: 1087,
      },
      type: LocationIconType.Town,
    },
    {
      id: 'kelet4',
      name: 'Kelet4',
      desc: 'Leírás',
      location: {
        x: 2945,
        y: 1085,
      },
      type: LocationIconType.Town,
    },
    {
      id: 'kelet5',
      name: 'Kelet5',
      desc: 'Leírás',
      location: {
        x: 2455,
        y: 1425,
      },
      type: LocationIconType.Town,
    },
  ];
  waterLocations: Location[] = [
    {
      id: 'mely_to',
      name: 'Mély tó',

      desc: 'Leírás',
      location: {
        x: 1770,
        y: 1285,
      },
      type: LocationIconType.Water,
    },
    {
      id: 'varangy_to',
      name: 'Varangy tó',

      desc: 'Leírás',
      location: {
        x: 2885,
        y: 1030,
      },
      type: LocationIconType.Water,
    },
    {
      id: 'deli_obol',
      name: 'Déli öböl',
      desc: 'A kontinens déli részén fekvő nagy öböl.',
      location: {
        x: 3350,
        y: 380,
      },
      type: LocationIconType.Water,
    },
  ];
  hillLocations: Location[] = [
    {
      id: 'folyokozi_nyugati_dombsag',
      name: 'Folyóközi nyugati dombság',

      desc: 'Leírás',
      location: {
        x: 1650,
        y: 1430,
      },
      type: LocationIconType.Hill,
    },
  ];
  mountainLocations: Location[] = [
    {
      id: 'doma',
      name: 'Doma testvér hegyek',
      desc: 'Doma Altiora két testvérvárosának alappillérei.',
      location: {
        x: 1170,
        y: 1100,
      },
      type: LocationIconType.Mountain,
    },
    {
      id: 'ozvegy_szigeti_hegyseg',
      name: 'Özvegy szigeti hegység',
      desc: 'Nincs élettársa, mert senki sem szereti XD.',
      location: {
        x: 2670,
        y: 850,
      },
      type: LocationIconType.Mountain,
    },
    {
      id: 'szigethegyek',
      name: 'Szigethegyek',
      desc: 'A fővárosnak otthont adó központi hegy és a körülötte megtelepedő faragott csúcsok együttes neve. A hegyek belsejében díszes csarnokokat vájtak ki amiket az évszázadok alatt feltöltöttek krónikákkal és hősi halottakkal. A területre jellemző meggyengült gravitációnak köszönhetően lehetetlennek tűnő épületek és természetes képződmények tűzdelik a területet, ilyenek a szigethegyek spirálos kövei amik esőzéskor elterelik a vizeket.',
      location: {
        x: 765,
        y: 1450,
      },
      type: LocationIconType.Mountain,
    },
    {
      id: 'keleti-kozep',
      name: 'Keleti középhegyek',
      desc: 'A Keleti tájék középső részén fekvő hegyek. Az innen eredő források olyan vízet szállítanak a hegyek lábánál fekvő ??? városába, melyeknél tisztábbat nem találni sehol. Egyesek úgy tartják, a víznek mágikus gyógyító hatása van, serkenti a vérkeringést és a csontregenerálódást.',
      location: {
        x: 2920,
        y: 1290,
      },
      type: LocationIconType.Mountain,
    },
  ];
  forestLocations: Location[] = [
    {
      id: 'erdo1',
      name: 'Erdő1',
      desc: 'Leírás',
      location: {
        x: 2050,
        y: 1250,
      },
      type: LocationIconType.Forest,
    },
    {
      id: 'erdo2',
      name: 'Erdő2',
      desc: 'Leírás',
      location: {
        x: 1900,
        y: 1500,
      },
      type: LocationIconType.Forest,
    },
    {
      id: 'erdo3',
      name: 'Erdő3',
      desc: 'Leírás',
      location: {
        x: 2700,
        y: 1200,
      },
      type: LocationIconType.Forest,
    },
    {
      id: 'erdo4',
      name: 'Erdő4',
      desc: 'Leírás',
      location: {
        x: 3100,
        y: 1000,
      },
      type: LocationIconType.Forest,
    },
    {
      id: 'erdo5',
      name: 'Erdő5',
      desc: 'Leírás',
      location: {
        x: 3400,
        y: 750,
      },
      type: LocationIconType.Forest,
    },
  ];
  otherLocations: Location[] = [
    {
      id: 'gat',
      name: 'Gát',
      desc: 'A Keleti tájék lakói építették még az idők kezdetekor az áradás elleni védekezés céljából. Amikor visszahúzódik a víz, egy masszív falként védi a terület dél-keleti oldalát.',
      location: {
        x: 3200,
        y: 900,
      },
      type: LocationIconType.Other,
    },
  ];

  locations: Location[][] = [
    this.cityLocations,
    this.townLocations,
    this.waterLocations,
    this.hillLocations,
    this.mountainLocations,
    this.forestLocations,
    this.otherLocations,
  ];

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

    this.createMarkers(this.cityLocations, this.cities);
    this.createMarkers(this.townLocations, this.towns);
    this.createMarkers(this.waterLocations, this.waters);
    this.createMarkers(this.hillLocations, this.hills);
    this.createMarkers(this.mountainLocations, this.mountains);
    this.createMarkers(this.forestLocations, this.forests);
    this.createMarkers(this.otherLocations, this.others);

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
}
