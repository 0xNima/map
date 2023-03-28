import {Map, View} from 'ol';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {OSM, Vector as VectorSource, XYZ} from 'ol/source';
import {Modify, Select, Snap} from 'ol/interaction';
import { defaultStyle, modifyStyle } from './mapSyles';
import { styleFunction } from './mapFunctions';


const googleMap = new TileLayer({
  source: new XYZ({
    url: 'http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}',
    maxZoom: 20,
  }),
  title: 'Google Map',
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
  style: modifyStyle,
});

export const snap = new Snap({
  source: vectorSource,
});

export const measureSnap = new Snap({
  source: measureSource,
});

export const mapLayers = [googleMap, vector, measureLayer];

export const map = new Map({
  target: 'map',
  layers: mapLayers,
  view: new View({
    center: [1000000, 6000000],
    zoom: 5
  }),
  controls: []
});
