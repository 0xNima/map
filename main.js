import './style.css';
import './pages.css';

import {vectorSource, mapLayers, measureSource, map} from './mapInit';
import { createLayer, selection } from './miscs';
import { addInteraction, addProvinces, draw, featuresFromProvince, provinceFromFeatures, removeInteractions, selectFeatures } from './mapFunctions';
import { fetchCountries, fetchGeodataList, fetchIndicators, loadFiles, sendQuery } from './api';
import { routes, initScripts } from './routes';
import {store} from './store';


let toolToggled = 0;

const leftSideBar = document.querySelector('.left');
const rightSideBar = document.querySelector('.right');
const rows = document.querySelectorAll('.row[data-type]');
const toolContainer = document.querySelector('.tool-container');
const sidebarHome = document.querySelector('.left .row.head .icon');
const country = document.querySelector('select[name="country"]');
const province = document.querySelector('select[name="province"]');
const indicator = document.querySelector('select[name="indicator"]');
const form = document.getElementById("query-form");


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

province.addEventListener('change', (e) => {
  const provinceCode = e.target.value;
  const ffp = store.get('main').get('ffp').get(provinceCode);

  selectFeatures(ffp);
});

country.addEventListener('change', async (e) => {
  const countryCode = e.target.value;
  
  fetchGeodataList(countryCode)
  .then(geoDataList => loadFiles(geoDataList))
  .then(geoJsonData => addProvinces(geoJsonData))
  .then(_ => {
    const map = featuresFromProvince();
    store.get('main').put('ffp', map);
  })
  .then(_ => {
    const provinces = provinceFromFeatures();

    const firstChild = province.firstElementChild; // <option></option>

    while(province.firstElementChild) {
      province.removeChild(province.firstElementChild);
    }
    
    if(firstChild) {
      province.appendChild(firstChild);
    }

    for(const [prov, info] of provinces) {
      const option = document.createElement('option');
      option.textContent = prov;
      option.name = info[0];
      option.value = info[1];
      province.appendChild(option)
    }
  })
  .then(_ => addInteraction('ProvinceSelect', {
    onselect: (e) => {
      const feature = e.selected[0];
      province.querySelector(`option[value="${feature.get("prov_code")[0]}"]`).selected = true;
    }
  }));
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(form);
  const data = {};
  
  for(const [k, v] of formData) {
    if(k == 'from-date' || k == 'to-date') {
      data[k] = new Date(v).getTime();
      continue
    }
    data[k] = v;
  }

  await sendQuery(data);
});

(async () => {
  const countris = await fetchCountries();
  const indicators = await fetchIndicators();

  for(const {code, name} of countris) {
    const option = document.createElement('option');
    option.textContent = name;
    option.value = code;
    country.appendChild(option);
  }

  for(const {type, name} of indicators) {
    const option = document.createElement('option');
    option.textContent = name;
    option.value = type;
    indicator.appendChild(option);
  }
})()