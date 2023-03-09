import {Draw} from 'ol/interaction';
import {getArea, getLength} from 'ol/sphere.js';
import {LineString, Point} from 'ol/geom.js';
import {map, modify, measureSource, vectorSource, select, snap} from './mapInit';
import { segmentStyle, style, labelStyle, tipStyle, modifyStyle} from "./mapSyles";



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


const removeInteractions = () => {
  map.removeInteraction(modify);
  map.removeInteraction(select);
  map.removeInteraction(draw);
  map.removeInteraction(select);
  map.getTargetElement().style.cursor = '';
}

export const addInteraction = (type) => {
  removeInteractions();

  switch(type) {
    case 'Select':
      map.getTargetElement().style.cursor = 'pointer';
      map.addInteraction(select);
      break;
    case 'Point':
    case 'LineString':
    case 'Polygon':
    case 'Circle':
      draw = new Draw({
        source: vectorSource,
        type: type,
      });
    
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
