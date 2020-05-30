import * as THREE from "three";
import {OrbitControls} from 'src/js/OrbitControls.js';

export { canvas, renderer, camera, scene };
let canvas, renderer, camera, scene, controls;

makeBackground();
function makeBackground() {

  canvas = document.querySelector('#c');
  renderer = new THREE.WebGLRenderer({canvas});
  renderer.physicallyCorrectLights = true;

  camera = makeCamera();
  camera.position.set(10, 20, 20).multiplyScalar(3);
  camera.lookAt(0, 0, 0);

  controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();

  renderer.setClearColor(0xAAAAAA);
  renderer.shadowMap.enabled = true;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xCCCCCC);
}

function makeCamera(fov = 40) {
  const aspect = 2;  // the canvas default
  const zNear = 0.1;
  const zFar = 1000;
  return new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
}
