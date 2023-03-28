import './style.css';
import {vectorSource, mapLayers, measureSource, map, select} from './mapInit';
import { createLayer } from './miscs';
import { addInteraction, draw } from './mapFunctions';
import { sendQuery } from './api';


let menuToggled = 0;
let toolToggled = 0;

const leftSideBar = document.querySelector('.left');
const rows = document.querySelectorAll('.row[data-type]');


// add menu click listener
document.querySelector('.menu').addEventListener('click', () => {
  menuToggled ^= 1;
  
  if (menuToggled) {
    leftSideBar.classList.replace('left-hide', 'left-show');
  } else {
    leftSideBar.classList.replace('left-show', 'left-hide');

    if (toolToggled) {
      toolToggled ^= 1;
      leftSideBar.classList.remove('left-narrow');
    }
  }
});

// add row click listener
for(const row of rows) {
  const route = parseInt(row.dataset.type);

  row.addEventListener('click', () => {
    toolToggled ^= 1;
    leftSideBar.classList.add('left-narrow');
  });
}

// disable drawing mode when click ESC
window.addEventListener('keydown', (e) => {
  if(e.key === 'Escape') {
    draw.removeLastPoint();
  }
});

// add draw listeners
// for(const tool of tools) {
//   const {type} = tool.dataset;

//   tool.addEventListener('click', () => {
//     addInteraction(type);
//     selectThis(tool);
//   });
// }

const clear = () => {
  vectorSource.getFeatures().forEach(feature => {
    vectorSource.removeFeature(feature);
  });
  measureSource.getFeatures().forEach(feature => {
    measureSource.removeFeature(feature);
  });
};

map.on('loadstart', () => {
  document.querySelector('.content').style.display = "block";
});