import './style.css';
import {vectorSource, mapLayers, measureSource, map} from './mapInit';
import { createLayer, selectThis } from './miscs';
import { addInteraction, draw } from './mapFunctions';


let showDrawer = 0;

const drawer = document.querySelector('.drawer');
const drawerIcon = document.querySelector('.toggle-drawer svg');
// const sideTools = document.querySelector('.side-tools');
const layersContainer = document.querySelector('.layers');
const tools = document.querySelectorAll('div[data-type]');
const clearBtn = document.querySelector('div[class="tools-icon"]:has(> svg[class="clear"])');
const sideClearBtn = document.querySelector('div[class="clear"]');


// add event listeners
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

// disable drawing mode when click ESC
window.addEventListener('keydown', (e) => {
  if(e.key === 'Escape') {
    draw.removeLastPoint();
  }
});

// add layers to drawer
for(const layer of mapLayers) {
  layersContainer.appendChild(
    createLayer(layer)
  );
}

// add draw listeners
for(const tool of tools) {
  const {type} = tool.dataset;

  tool.addEventListener('click', () => {
    addInteraction(type);
    selectThis(tool);
  });
}

const clear = () => {
  vectorSource.getFeatures().forEach(feature => {
    vectorSource.removeFeature(feature);
  });
  measureSource.getFeatures().forEach(feature => {
    measureSource.removeFeature(feature);
  });
};

// add clear btn's handler
clearBtn.addEventListener('click', clear);
sideClearBtn.addEventListener('click', clear);

map.on('loadstart', () => {
  drawer.style.display = 'block';
});