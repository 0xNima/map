import {Map, View} from 'ol';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Modify, Select, Snap} from 'ol/interaction';
import { defaultStyle, modifyStyle } from './mapSyles';
import { styleFunction } from './mapFunctions';


const raster = new TileLayer({
  source: new OSM(),
  title: 'Base OSM Layer',
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

export const mapLayers = [raster, vector, measureLayer];

export const map = new Map({
  target: 'map',
  layers: mapLayers,
  view: new View({
    center: [1000000, 6000000],
    zoom: 5
  }),
});