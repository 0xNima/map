import './style.css';
import './pages.css';

import {vectorSource, mapLayers, measureSource, map, select} from './mapInit';
import { createLayer, selection } from './miscs';
import { draw, removeInteractions } from './mapFunctions';
import { sendQuery } from './api';
import { routes, initScripts } from './routes';


let menuToggled = 0;
let toolToggled = 0;

const leftSideBar = document.querySelector('.left');
const rows = document.querySelectorAll('.row[data-type]');
const toolContainer = document.querySelector('.tool-container');
const sidebarHome = document.querySelector('.row.head .icon');

// add menu click listener
document.querySelector('.menu').addEventListener('click', () => {
  menuToggled ^= 1;

  if (menuToggled) {
    leftSideBar.classList.replace('left-hide', 'left-show');
  } else {
    removeInteractions();

    toolContainer.innerHTML = '';

    leftSideBar.classList.replace('left-show', 'left-hide');

    if (toolToggled) {
      toolToggled = 0;
      leftSideBar.classList.remove('left-narrow');
    }
  }
});

// add row click listener
for(const row of rows) {
  const route = parseInt(row.dataset.type);

  row.addEventListener('click', async () => {
    removeInteractions();

    toolToggled = 1;
    leftSideBar.classList.add('left-narrow');
    
    selection(row, '.left-narrow .row', 'selected');
    
    const content = await (await fetch(routes[route - 1])).text()
    toolContainer.innerHTML = content;

    initScripts[route - 1]();
  });
}


sidebarHome.addEventListener('click', () => {
  toolToggled = 0;
  leftSideBar.classList.remove('left-narrow');
})

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