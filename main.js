import './style.css';
import {vectorSource, mapLayers, measureSource, map, select} from './mapInit';
import { createLayer, selectThis } from './miscs';
import { addInteraction, draw } from './mapFunctions';
import { sendQuery } from './api';


let showDrawer = 0;

const drawer = document.querySelector('.drawer');
const drawerIcon = document.querySelector('.toggle-drawer svg');
const layersContainer = document.querySelector('.layers');
const tools = document.querySelectorAll('div[data-type]');
const clearBtn = document.querySelector('div[class="tools-icon"]:has(> svg[class="clear"])');
const sideClearBtn = document.querySelector('div[class="clear"]');
const queryCheckboxes = document.querySelectorAll('.query input');
const queryBtn = document.querySelector('.sendQuery');

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


// add listener to Query btn
queryBtn.addEventListener('click', () => {
  const queries = [];
  for(const checkbox of queryCheckboxes) {
    if(checkbox.checked) {
      queries.push(checkbox.dataset.query);
      checkbox.checked = false;
    }
  }

  const selected = select.getFeatures().getArray();

  if(queries.length && selected.length) {

    const promises = selected.map(feature => {
      return sendQuery({
        queries: queries,
        coordinates: feature.getGeometry().getCoordinates(),
      })
    });

    Promise.all(promises).then(result => {

    });
  }
});


map.on('loadstart', () => {
  drawer.style.display = 'block';
});