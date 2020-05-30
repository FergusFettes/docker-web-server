import * as THREE from "three";
import { canvas, scene } from "src/background.js";
import * as mat from "src/material.js";
import { klein } from "src/shapes.js";
import { makeLights } from "src/lights.js";
import { render, render_objects } from "src/render.js";

const loadingElem = document.querySelector('#loading');
const progressBarElem = loadingElem.querySelector('.progressbar');

const spread = 15;

makeLights();
init();
requestAnimationFrame(render);
function init() {

  for (let i = 0; i < 2; i++){
    const slices = 25;
    const stacks = 25;
    addSolidGeometry((i * 6) - 3, 0, new THREE.ParametricBufferGeometry(klein, slices, stacks), 0.1);
  }

  for (let i = 0; i < 5; i++) {
    const width = 8;
    const height = 8;
    const depth = 8;
    addSolidGeometry(
      i - 2,
      i - 2,
      new THREE.BoxBufferGeometry(width, height, depth),
      0.1);
  }

  for (let i = 0; i < 100; i++) {
    const radius = (Math.sin(i * Math.PI) * 3.5) + 1.75;
    const tube = Math.random(1.5) * 2;
    const radialSegments = 8;
    const tubularSegments = 64;
    const p = 2;
    const q = 3;
    addSolidGeometry(
      (i % 15) - 7,
      (i / 5) - 10,
      new THREE.TorusKnotBufferGeometry(radius, tube, tubularSegments, radialSegments, p, q),
      1);
  }


  mat.loadManager.onLoad = () => {
    loadingElem.style.display = 'none';
    const geometry = new THREE.BoxBufferGeometry(18, 18, 18)
    const cube = new THREE.Mesh(geometry, mat.materials);
    addObject(0, 0, cube, 0.1)
  };

  mat.loadManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) => {
  const progress = itemsLoaded / itemsTotal;
  progressBarElem.style.transform = `scaleX(${progress})`;
  };

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
  render_objects.push([obj, speed]);
}
