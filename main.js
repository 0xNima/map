import './style.css';
import {Map, View} from 'ol';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {OSM, Vector as VectorSource} from 'ol/source';
import Draw from 'ol/interaction/Draw.js';


const raster = new TileLayer({source: new OSM()});

const vectorSource = new VectorSource({wrapX: false});

const vector = new VectorLayer({source: vectorSource});

const map = new Map({
  target: 'map',
  layers: [raster, vector],
  view: new View({
    center: [0, 0],
    zoom: 2
  }),
});


const drawer = document.querySelector('.drawer');

let showDrawer = 0;

document.querySelector('.toggle-drawer').addEventListener('click', () => {
  showDrawer = 1 ^ showDrawer;
  if(showDrawer) {
    drawer.classList.replace('hide', 'show');
  } else {
    drawer.classList.replace('show', 'hide');
  }
});



// const typeSelect = document.getElementById('type');

// let draw;

// function addInteraction() {
//   const value = typeSelect.value;
//   if (value !== 'None') {
//     draw = new Draw({
//       source: vectorSource,
//       type: typeSelect.value,
//     });
//     map.addInteraction(draw);
//   }
// }


// typeSelect.onchange = function () {
//   map.removeInteraction(draw);
//   addInteraction();
// };

// document.getElementById('undo').addEventListener('click', function () {
//   draw.removeLastPoint();
// });

// addInteraction();
