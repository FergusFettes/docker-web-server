import * as THREE from "three";
import {GUI} from 'src/third_party/dat-gui.js';
import {OrbitControls} from 'src/js/OrbitControls.js';
import { MinMaxGUIHelper, PickHelper } from "src/classes.js";

export { canvas, renderer, camera, cameraPole, scene, gui, touchListeners, pickPosition, pickHelper, showLink, cubeMap, infoElem };
let canvas, renderer, camera, cameraPole, scene, controls, gui, pickPosition, pickHelper, cubeMap, infoElem;

gui = new GUI();
cubeMap = new WeakMap();
infoElem = document.querySelector('#info');

makeBackground();
touchListeners();
clearPickPosition();
function makeBackground() {

  pickPosition = {x: 0, y: 0};
  pickHelper = new PickHelper();

  canvas = document.querySelector('#c');
  renderer = new THREE.WebGLRenderer({canvas, alpha: true});
  // renderer.physicallyCorrectLights = true;

  camera = makeCamera(80);
  camera.position.set(0, 0, 0).multiplyScalar(2);
  camera.lookAt(0, 0, 0);

  // controls = new OrbitControls(camera, canvas);
  // controls.target.set(0, 0, 0);
  // controls.update();

  // renderer.setClearColor(0xAAAAAA);
  renderer.shadowMap.enabled = true;

  scene = new THREE.Scene();
  // scene.background = new THREE.Color(0xCCCCCC);

  // put the camera on a pole (parent it to an object)
  // so we can spin the pole to move the camera around the scene
  cameraPole = new THREE.Object3D();
  scene.add(cameraPole);
  cameraPole.add(camera);

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

function touchListeners() {
  window.addEventListener('mousemove', setPickPosition);
  window.addEventListener('mouseout', clearPickPosition);
  window.addEventListener('mouseleave', clearPickPosition);
  window.addEventListener('mouseup', (event) => {
    event.preventDefault();
    clearPickPosition();
    goToLink();
  }, {passive: false});
  window.addEventListener('touchstart', (event) => {
    // prevent the window from scrolling
    event.preventDefault();
    setPickPosition(event.touches[0]);
  }, {passive: false});
  window.addEventListener('touchmove', (event) => {
    setPickPosition(event.touches[0]);
  });
  window.addEventListener('touchend', (event) => {
    clearPickPosition();
    goToLink();
  }, {passive: false});
}

function clearPickPosition() {
  // unlike the mouse which always has a position
  // if the user stops touching the screen we want
  // to stop picking. For now we just pick a value
  // unlikely to pick something
  pickPosition.x = -100000;
  pickPosition.y = -100000;
}

function setPickPosition(event) {
  const pos = getCanvasRelativePosition(event);
  pickPosition.x = (pos.x / canvas.width ) *  2 - 1;
  pickPosition.y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y
}

function getCanvasRelativePosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * canvas.width  / rect.width,
    y: (event.clientY - rect.top ) * canvas.height / rect.height,
  };
}

function showLink() {
  if (cubeMap.get(pickHelper.pickedObject)) {
      infoElem.textContent = cubeMap.get(pickHelper.pickedObject);
  } else {
      infoElem.textContent = ''
  }
}

function goToLink() {
  if (cubeMap.get(pickHelper.pickedObject)) {
      const link = cubeMap.get(pickHelper.pickedObject);
      window.open(link);
  }
  infoElem.textContent = ''
}
