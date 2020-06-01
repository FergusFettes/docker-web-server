import * as THREE from "three";
import { canvas, scene } from "src/background.js";
import { materials, loadManager } from "src/material.js";
import { klein } from "src/shapes.js";
import { makeLights } from "src/lights.js";
import { render, renderObjects, touchListeners, clearPickPosition } from "src/render.js";
import { AxisGridHelper } from "src/classes.js";

const loadingElem = document.querySelector('#loading');
const progressBarElem = loadingElem.querySelector('.progressbar');

const spread = 15;

makeLights();
init();
requestAnimationFrame(render);
touchListeners();
clearPickPosition();
function init() {

  loadManager.onLoad = () => {
    loadingElem.style.display = 'none';
    materials.forEach((material, ndx) => {
      const geometry = new THREE.BoxGeometry(14, 14, 14);
      const cube = new THREE.Mesh(geometry, material);
      randomOrbit(cube, 1, 0.5);
    });
  };

  loadManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) => {
  const progress = itemsLoaded / itemsTotal;
  progressBarElem.style.transform = `scaleX(${progress})`;
  };

}

function randomOrbit(obj, speed, obj_speed) {
  const orbit = new THREE.Object3D();
  scene.add(orbit);
  renderObjects.push([orbit, speed]);
  const point = getPointOnSphere();
  obj.position.x = point['x'] * 100
  obj.position.y = point['y'] * 100
  obj.position.z = point['z'] * 100
  orbit.add(obj);
  renderObjects.push([obj, obj_speed]);
}

function addObject(x, y, obj, speed) {
  obj.position.x = x * spread;
  obj.position.y = y * spread;

  scene.add(obj);
  renderObjects.push([obj, speed]);
}

function getPointOnSphere() {
  let d, x, y, z;
  do {
      x = Math.random() * 2.0 - 1.0;
      y = Math.random() * 2.0 - 1.0;
      z = Math.random() * 2.0 - 1.0;
      d = x*x + y*y + z*z;
  } while((d > 1.1) || (d < 0.9));
  return {x: x, y: y, z: z};
}
