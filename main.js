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
const drawerIcon = document.querySelector('.toggle-drawer svg');

let showDrawer = 0;

document.querySelector('.toggle-drawer').addEventListener('click', () => {
  showDrawer = 1 ^ showDrawer;
  if(showDrawer) {
    drawer.classList.replace('hide', 'show');
    drawerIcon.classList.replace('rotate-0', 'rotate-180');
  } else {
    drawer.classList.replace('show', 'hide');
    drawerIcon.classList.replace('rotate-180', 'rotate-0');
  }
}); 


const showMoreIcons = document.querySelectorAll('.section svg');
for(const icon of showMoreIcons) {
  const sibling = icon.previousElementSibling;
  icon.addEventListener('click', () => {
    if(icon.classList.replace('rotate-0', 'rotate-180')) {
      sibling.classList.replace('up', 'down');
    } else {
      sibling.classList.replace('down', 'up');
      icon.classList.replace('rotate-180', 'rotate-0');
    }
  });
}



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
