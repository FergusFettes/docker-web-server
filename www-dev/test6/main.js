import * as THREE from "three";
import { canvas, scene, touchListeners } from "src/background.js";
import * as mat from "src/material.js";
import { klein } from "src/shapes.js";
import { makeLights } from "src/lights.js";
import { render, renderObjects } from "src/render.js";
import { AxisGridHelper, PickHelper } from "src/classes.js";

const loadingElem = document.querySelector('#loading');
const progressBarElem = loadingElem.querySelector('.progressbar');

const pickPosition = {x: 0, y: 0};
const pickHelper = new PickHelper();

const cubeMap = new WeakMap();
const infoElem = document.querySelector('#info');

const spread = 15;

makeLights();
init();
requestAnimationFrame(render);
touchListeners();
function init() {

  mat.loadManager.onLoad = () => {
    loadingElem.style.display = 'none';
    mat.materials.forEach((material, ndx) => {
      const geometry = new THREE.BoxBufferGeometry(18, 18, 18);
      const cube = new THREE.Mesh(geometry, material);
      randomOrbit(cube, 1, 0.5);
    });
  };

  mat.loadManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) => {
  const progress = itemsLoaded / itemsTotal;
  progressBarElem.style.transform = `scaleX(${progress})`;
  };
}

function randomOrbit(obj, speed, obj_speed) {
  const orbit = new THREE.Object3D();
  scene.add(orbit);
  renderObjects.push([orbit, speed]);
  const point = getPointOnSphere();
  obj.position.x = point['x'] * 50
  obj.position.y = point['y'] * 50
  obj.position.z = point['z'] * 50
  orbit.add(obj);
  renderObjects.push([obj, obj_speed]);
}

function addSolidGeometry(x, y, geometry, speed) {
  const mesh = new THREE.Mesh(geometry, mat.createMaterial());
  addObject(x, y, mesh, speed);
}

function addLineGeometry(x, y, geometry, speed) {
  const material = new THREE.LineBasicMaterial({color: 0x000000});
  const mesh = new THREE.LineSegments(geometry, material);
  addObject(x, y, mesh, speed);
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

function makeAxisGrid(node, label, units) {
  const helper = new AxisGridHelper(node, units);
  gui.add(helper, 'visible').name(label);
}
