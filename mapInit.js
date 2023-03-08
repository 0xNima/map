import {Map, View} from 'ol';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {OSM, Vector as VectorSource, XYZ} from 'ol/source';
import {Modify, Select, Snap} from 'ol/interaction';
import { defaultStyle, modifyStyle } from './mapSyles';
import { styleFunction } from './mapFunctions';
import { API_KEY } from './env';


const raster = new TileLayer({
  source: new OSM(),
  title: 'Base OSM Layer',
  visible: true,
});

const maptiler = new TileLayer({
  source: new XYZ({
    url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + API_KEY,
    maxZoom: 20,
  }),
  title: 'Maptiler Satelite Layer',
  visible: true,
});

const arcgisOnline = new TileLayer({
    source: new XYZ({
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      maxZoom: 20,
    }),
    title: 'ArcGIS online Layer',
    visible: true,
});

const maptilerStreet = new TileLayer({
    source: new XYZ({
      url: 'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=' + API_KEY,
      maxZoom: 20,
    }),
    title: 'Maptiler Street Layer',
    visible: true,
});

export const vectorSource = new VectorSource({wrapX: false});

const vector = new VectorLayer({
  source: vectorSource,
  title: 'Draw Layer',
  visible: true,
  style: defaultStyle,
});


export const measureSource = new VectorSource({wrapX: false});

const measureLayer = new VectorLayer({
  source: measureSource,
  title: 'Measure Layer',
  visible: true,
  style: function (feature) {
    return styleFunction(feature);
  }
});

export const select = new Select();

export const modify = new Modify({
  features: select.getFeatures(),
  source: vectorSource,
  style: modifyStyle,
});

export const snap = new Snap({
  source: vectorSource,
});

export const mapLayers = [raster, maptilerStreet, maptiler, arcgisOnline, vector, measureLayer];

export const map = new Map({
  target: 'map',
  layers: mapLayers,
  view: new View({
    center: [1000000, 6000000],
    zoom: 5
  }),
});