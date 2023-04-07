import './style.css';
import './pages.css';

import {vectorSource, mapLayers, measureSource, map} from './mapInit';
import { createLayer, selection } from './miscs';
import { addInteraction, addProvinces, draw, removeInteractions } from './mapFunctions';
import { fetchCountries, fetchGeodataList, loadFiles, sendQuery } from './api';
import { routes, initScripts } from './routes';
import {store} from './store';


let toolToggled = 0;

const leftSideBar = document.querySelector('.left');
const rightSideBar = document.querySelector('.right');
const rows = document.querySelectorAll('.row[data-type]');
const toolContainer = document.querySelector('.tool-container');
const sidebarHome = document.querySelector('.left .row.head .icon');
const dateInputs = document.querySelectorAll('input[type="date"]');
const country = document.querySelector('select[name="country"');

const today = new Date();

for(const input of dateInputs) {
  input.valueAsDate = today;
}

// add menu click listener
document.querySelector('.menu').addEventListener('click', () => {
  const appeared = leftSideBar.classList.toggle('left-show');
  if(!appeared) {
    removeInteractions();

    toolContainer.innerHTML = '';

    if (toolToggled) {
      toolToggled = 0;
      leftSideBar.classList.remove('left-narrow');
    }
  }
});

// add query panel click listener
document.querySelector('.query-panel-menu').addEventListener('click', () => {
  rightSideBar.classList.toggle('right-show');
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


country.addEventListener('change', async (e) => {
  const countryCode = e.target.value;
  const geoDataList = await fetchGeodataList(countryCode);
  const geoJsonData = await loadFiles(geoDataList);

  addProvinces(geoJsonData);

  addInteraction('ProvinceSelect', {
    onselect: (e) => {
      const features = e.selected;
      const data = [];

      for(const feature of features) {
        data.push(feature.getProperties())
      }
    }
  });
});

(async () => {
  const countris = await fetchCountries();
  for(const {code, name} of countris) {
    const option = document.createElement('option');
    option.textContent = name;
    option.value = code;
    country.appendChild(option);
  }
})()