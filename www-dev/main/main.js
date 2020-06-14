import * as THREE from "three";
import { createYouCube } from 'src/youcube.js'
import { canvas, scene, mainCamera, makeCamera, cameras, controls } from "src/background.js";
import { materials, loadManager, imageMap } from "src/material.js";
import { makeLights } from "src/lights.js";
import { render, touchListeners, elementListeners } from "src/render.js";

const loadingElem = document.querySelector('#loading');
const progressBarElem = loadingElem.querySelector('.progressbar');

const multiply = 7;
const spread = 80 * multiply;

const logo = 'https://blog.schau-wien.at/wp-content/uploads/2020/04/logo.jpg'
const logos = []
for (let i = 0; i < 3; i ++) {
  logos.push(logo);
}


makeLights();
init();
requestAnimationFrame(render);
touchListeners();
elementListeners();
function init() {
  loadManager.onLoad = () => {
    loadingElem.style.display = 'none';
    materials.forEach((material, ndx) => {
      const cube = randomCameraCube(material, spread)
      const youcube = createYouCube(0, 0, 0, 100, 0.8, logos, 'image');
      cube.add(youcube);
      cube.layers.set(0);
      scene.add(cube);
    });
  };

  loadManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) => {
  const progress = itemsLoaded / itemsTotal;
  progressBarElem.style.transform = `scaleX(${progress})`;
  };

}

function randomCameraCube(material, spread) {
  const geometry = new THREE.BoxBufferGeometry(14 * multiply, 14 * multiply, 14 * multiply);
  const cube = new THREE.Mesh(geometry, material);
  const point = getPointOnSphere();
  cube.position.set(
    point['x'] * spread,
    point['y'] * spread,
    point['z'] * spread
)
  cube.rotation.set(rand(Math.PI), rand(Math.PI), 0);
  const camera = makeCamera(120)
  camera.layers.enable(0);
  camera.layers.enable(1);

  cube.add(camera)
  cameras.set(camera, `welcome to the cube of ${imageMap.get(material)}`)
  return cube
}

// function randomOrbit(obj, orbit_speed, obj_speed, scale) {
//   const orbit = new THREE.Object3D();
//   scene.add(orbit);
//   renderObjects.push([orbit, orbit_speed]);
//   const point = getPointOnSphereBehindCamera();
//   obj.position.x = point['x'] * scale
//   obj.position.y = point['y'] * scale
//   obj.position.z = point['z'] * scale
//   orbit.add(obj);
//   renderObjects.push([obj, obj_speed]);
// }

// function addObject(x, y, obj, speed) {
//   obj.position.x = x * spread;
//   obj.position.y = y * spread;

  // scene.add(obj);
  // renderObjects.push([obj, speed]);
// }

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

function rand(min, max) {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return min + (max - min) * Math.random();
}
