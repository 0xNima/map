import {Overlay} from 'ol';
import { addInteraction } from "./mapFunctions";
import { map } from './mapInit';
import { createLabel, selection } from "./miscs";
import { store } from './store';

// create store
store.bulk_create(['map', 'catalog', 'filter', 'measure', 'draw', 'main']);

export const routes = [
    'pages/help.html', 'pages/map.html', 'pages/catalog.html', 'pages/filter.html', 'pages/measure.html',
    'pages/draw.html', 'pages/import-export.html', 'pages/share.html', 'pages/print.html', 'pages/advanced.html',
]

const helpScript = (() => {
    
});

const mapScript = (() => {

});

const catalogScript = (() => {

});

const filterScript = (() => {

});

const measureScript = (() => {

});

const drawScript = (() => {
    const tools = document.querySelectorAll('.toolset a');
    const layersContainer = document.querySelector('.draw-labels');
    const labelHeader = document.querySelector('.draw-label-header input');
    const trash = document.querySelector('.draw-label-header svg');

    const drwaStore = store.get('draw');
    const prevLabels = drwaStore.get('labels');

    let enable = false;

    const onChecked = function(checked) {
        this[0][1] = checked;

        if(checked) {
            this[1].classList.replace('hidden', 'visible');
            trash.removeAttribute('disable');
            trash.classList.add('trash');
        } else {
            this[1].classList.replace('visible', 'hidden');
            
            const checkedCheckboxes = document.querySelectorAll('.draw-label:has(input:checked)');
            if(checkedCheckboxes.length === 0) {
                trash.setAttribute('disable', 1);
                trash.classList.remove('trash');
                labelHeader.checked = false;
            }
        }
    }

    if (prevLabels) {
        for(const [id, value] of prevLabels.entries()) {
            const overlay = map.getOverlayById(id).getElement();
            if(overlay) {
                layersContainer.appendChild(
                    createLabel(id, ...value, onChecked.bind([value, overlay]))
                );
                if(value[1]) {
                    enable = true;
                }
            }
        }
    }

    if (enable) {
        trash.removeAttribute('disable');
        trash.classList.add('trash');
    }

    for(const tool of tools) {
        const type = tool.dataset.type;

        tool.addEventListener('click', () => {
            selection(tool, '.toolset a', 'draw-selected');

            addInteraction(type, {
                drawEnd: (e) => {
                    const labelText = prompt('Enter Label');
    
                    const node = document.createElement('div');
                    const id = Date.now();
    
                    node.classList.add('visible');
    
                    const label = new Overlay({
                        positioning: 'bottom-center',
                        element: node,
                        offset: [0, 0],
                        id: id
                    });
                    
                    const map = e.target.getMap();
    
                    map.addOverlay(label);
    
                    const feature = e.feature;
                    const geometry = feature.getGeometry();
                    
                    feature.setId(id);
    
                    let labelPoint = null;
    
                    switch(geometry.getType()) {
                        case 'Point':
                            labelPoint = geometry.getCoordinates();
                            break
                        case 'LineString':
                            labelPoint = geometry.getFlatMidpoint();
                            break
                        case 'Polygon':
                            labelPoint = geometry.getInteriorPoint().getCoordinates();
                            break
                        case 'Circle':
                            labelPoint = geometry.getCenter();
                            break
                    }
                    
                    const content = `<div class="label-text">${labelText}</div>`;
                    
                    const visible = true;
                    
                    label.setPosition(labelPoint);
                    label.getElement().innerHTML = content;
                    
                    const value = [labelText, visible];
                    drwaStore.setDefault('labels', new Map()).set(id, value);
    
                    layersContainer.appendChild(
                        createLabel(id, labelText, visible, onChecked.bind([value, node]))
                    );
                    
                    trash.removeAttribute('disable');
                    trash.classList.add('trash');
                }
            });
        });
    }

    labelHeader.addEventListener('click', (e) => {
        const labels = document.querySelectorAll('.draw-label');
        const storeLabels = drwaStore.get('labels');

        if(labels.length === 0) {
            return
        }

        const checked = e.target.checked;

        for(const label of labels) {
            const id = parseInt(label.dataset.id);
            const overlay = map.getOverlayById(id).getElement();
            
            if(checked) {
                overlay.classList.replace('hidden', 'visible');
            } else {
                overlay.classList.replace('visible', 'hidden');
            }

            storeLabels.get(id)[1] = checked;
            label.querySelector('input').checked = checked;
        }

        if(checked) {
            trash.removeAttribute('disable');
            trash.classList.add('trash');
        } else {
            trash.setAttribute('disable', 1);
            trash.classList.remove('trash');
        }
    });

    trash.addEventListener('click', (e) => {
        const target = e.currentTarget;
        if(!target.hasAttribute('disable')) {
            target.setAttribute('disable', 1);
            target.classList.remove('trash');
            target.checked = false;

            const checkedChilds = Array.from(
                document.querySelectorAll('.draw-label:has(input:checked)')
            );

            const labels = drwaStore.get('labels');

            while(checkedChilds.length) {
                const child = checkedChilds.pop();
                const id = parseInt(child.dataset.id);
                labels.delete(id);
                layersContainer.removeChild(child);

                map.removeOverlay(map.getOverlayById(id));

                const drawLayer = map.getAllLayers()[1]; // 1: draw layer index
                const feature = drawLayer.getSource().getFeatureById(id);
                drawLayer.getSource().removeFeature(feature);
            }
        }
    });
});

const importExportScript = (() => {

});

const shareScript = (() => {

});

const printScript = (() => {

});

const advancedScript = (() => {

});

export const initScripts = [
    helpScript, mapScript, catalogScript, filterScript, measureScript, 
    drawScript, importExportScript, shareScript, printScript, advancedScript,
]