import * as THREE from "three";
import {GUI} from 'src/third_party/dat-gui.js';
import {OrbitControls} from 'src/js/OrbitControls.js';
import { MinMaxGUIHelper } from "src/classes.js";

export { canvas, renderer, camera, scene, gui };
let canvas, renderer, camera, scene, controls, gui;

gui = new GUI();

makeBackground();
function makeBackground() {

  canvas = document.querySelector('#c');
  renderer = new THREE.WebGLRenderer({canvas});
  renderer.physicallyCorrectLights = true;

  camera = makeCamera(80);
  camera.position.set(0, 0, 50).multiplyScalar(2);
  camera.lookAt(0, 0, 0);

  // controls = new OrbitControls(camera, canvas);
  // controls.target.set(0, 0, 0);
  // controls.update();

  renderer.setClearColor(0xAAAAAA);
  renderer.shadowMap.enabled = true;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xCCCCCC);

  const gui = new GUI();
  gui.add(camera, 'fov', 1, 180).onChange(updateCamera);
  const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
  gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
  gui.add(minMaxGUIHelper, 'max', 0.1, 1000, 0.1).name('far').onChange(updateCamera);

}

function updateCamera() {
  camera.updateProjectionMatrix();
}

function makeCamera(fov = 40) {
  const aspect = 2;  // the canvas default
  const zNear = 0.1;
  const zFar = 300;
  return new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
}

