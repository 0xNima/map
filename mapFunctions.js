import {Draw} from 'ol/interaction';
import {getArea, getLength} from 'ol/sphere.js';
import {LineString, Point} from 'ol/geom.js';
import {GeoJSON} from 'ol/format.js';
import {map, modify, measureSource, vectorSource, modifySelect, snap, provinceLayerSource, provinceSelectClick} from './mapInit';
import { segmentStyle, style, labelStyle, tipStyle, modifyStyle} from "./mapSyles";
import {v4} from 'uuid';
import { PersistMap } from './miscs';

export let draw = null;
export let tipPoint = null;

const segmentStyles = [segmentStyle];


const formatLength = function (line) {
    const length = getLength(line);
    let output;
    if (length > 100) {
      output = Math.round((length / 1000) * 100) / 100 + ' km';
    } else {
      output = Math.round(length * 100) / 100 + ' m';
    }
    return output;
};

const formatArea = function (polygon) {
    const area = getArea(polygon);
    let output;
    if (area > 10000) {
      output = Math.round((area / 1000000) * 100) / 100 + ' km\xB2';
    } else {
      output = Math.round(area * 100) / 100 + ' m\xB2';
    }
    return output;
};


export function styleFunction(feature, drawType, tip) {
  const styles = [style];
  const geometry = feature.getGeometry();
  const type = geometry.getType();
  
  let point, label, line;

  if (!drawType || drawType === type) {
    if (type === 'Polygon') {
      point = geometry.getInteriorPoint();
      label = formatArea(geometry);
      line = new LineString(geometry.getCoordinates()[0]);
    } else if (type === 'LineString') {
      point = new Point(geometry.getLastCoordinate());
      label = formatLength(geometry);
      line = geometry;
    }
  }

  if (line) {
    let count = 0;
    line.forEachSegment(function (a, b) {
      const segment = new LineString([a, b]);
      const label = formatLength(segment);
      if (segmentStyles.length - 1 < count) {
        segmentStyles.push(segmentStyle.clone());
      }
      const segmentPoint = new Point(segment.getCoordinateAt(0.5));
      segmentStyles[count].setGeometry(segmentPoint);
      segmentStyles[count].getText().setText(label);
      styles.push(segmentStyles[count]);
      count++;
    });
  }

  if (label) {
    labelStyle.setGeometry(point);
    labelStyle.getText().setText(label);
    styles.push(labelStyle);
  }

  if (
    tip &&
    type === 'Point' &&
    !modify.getOverlay().getSource().getFeatures().length
  ) {
    tipPoint = geometry;
    tipStyle.getText().setText(tip);
    styles.push(tipStyle);
  }
  return styles;
}


export const removeInteractions = () => {
  map.removeInteraction(modify);
  map.removeInteraction(modifySelect);
  map.removeInteraction(draw);
  map.getTargetElement().style.cursor = '';
}

export const addInteraction = (type, options) => {
  removeInteractions();

  switch(type) {
    case 'ModifySelect':
      map.getTargetElement().style.cursor = 'pointer';
      map.addInteraction(modifySelect);
      if('onselect' in options ) {
        modifySelect.removeEventListener('select');
        modifySelect.on('select', (e) => options.onselect(e));
      }
      break;
    case 'ProvinceSelect':
      map.getTargetElement().style.cursor = 'pointer';
      map.addInteraction(provinceSelectClick);
      if('onselect' in options ) {
        provinceSelectClick.removeEventListener('select');
        provinceSelectClick.on('select', (e) => options.onselect(e));
      }
      break
    case 'Point':
    case 'LineString':
    case 'Polygon':
    case 'Circle':
      draw = new Draw({
        source: vectorSource,
        type: type,
      });

      if('drawStart' in options) draw.on('drawstart', options.drawStart);

      if('drawEnd' in options) draw.on('drawend', options.drawEnd);

      map.addInteraction(draw);
      map.addInteraction(snap);
      break
    case 'Modify':
      map.addInteraction(select);
      map.addInteraction(modify);
      map.addInteraction(snap);
      break;
    case 'MeasureLineString':
    case 'MeasurePolygon':
      const drawType = type.replace('Measure', '');
      const activeTip = 'Click to continue drawing the ' +
      (drawType === 'Polygon' ? 'polygon' : 'line');
      const idleTip = 'Click to start measuring';
      let tip = idleTip;

      draw = new Draw({
        source: measureSource,
        type: drawType,
        style: function (feature) {
          return styleFunction(feature, drawType, tip);
        },
      });

      draw.on('drawstart', function () {
        modify.setActive(false);
        tip = activeTip;
      });

      draw.on('drawend', function () {
        modifyStyle.setGeometry(tipPoint);
        modify.setActive(true);
        map.once('pointermove', function () {
          modifyStyle.setGeometry();
        });
        tip = idleTip;
      });
      modify.setActive(true);

      map.addInteraction(draw);
      map.addInteraction(modify);
      break
    default:
      break
  }
}


export const addProvinces = (geoJsonData) => {
  const oldFeatures = provinceLayerSource.getFeatures();
  for(const feature of oldFeatures) {
    provinceLayerSource.removeFeature(feature);
  }

  for(const data of geoJsonData) {
    provinceLayerSource.addFeatures(
      new GeoJSON({
        featureProjection: 'EPSG:3857'
      }).readFeatures(data)
    );
  }

  for(const feature of provinceLayerSource.getFeatures()) {
    feature.setId(v4());
  }
};

export const provinceFromFeatures = () => {
  const provinces = new Map();

  for(const feature of provinceLayerSource.getFeatures()) {
    const {prov_name_en, prov_area_code, prov_code} = feature.getProperties(); 
    
    provinces.set(
      prov_name_en[0], 
      [prov_area_code, prov_code[0]]
    );
  }

  return provinces
};


export const featuresFromProvince = () => {
  const map = new PersistMap();

  for(const feature of provinceLayerSource.getFeatures()) {
    const {prov_code} = feature.getProperties(); 
    
    map.setDefault(prov_code[0], []).push(feature.getId());
  }

  return map
}

export const selectFeatures = (featuresIds) => {
  if (!featuresIds) {
    provinceSelectClick.getFeatures().clear(); // clear previous selections
    return
  }
  
  const features = featuresIds.map(id => provinceLayerSource.getFeatureById(id));

  provinceSelectClick.getFeatures().clear(); // clear previous selections
  features.forEach(feature => provinceSelectClick.getFeatures().push(feature));
}