import * as THREE from "three";
// import {GUI} from 'src/third_party/dat-gui.js';
import {OrbitControls} from 'src/js/OrbitControls.js';
import { MinMaxGUIHelper } from "src/classes.js";

export { canvas, renderer, cameras, cameraPole, scene, gui, makeCamera };
let canvas, renderer, cameras, cameraPole, scene, controls, gui;

// gui = new GUI();

makeBackground();
function makeBackground() {

  canvas = document.querySelector('#c');
  renderer = new THREE.WebGLRenderer({canvas, alpha: true});
  // renderer.physicallyCorrectLights = true;

  {
    const camera = makeCamera(80);
    camera.position.set(0, 0, 25).multiplyScalar(3);
    camera.lookAt(0, 0, 0);
    cameras = [];
    cameras.push({cam: camera, desc: 'main camera'})
  }

  // controls = new OrbitControls(camera, canvas);
  // controls.target.set(0, 0, 0);
  // controls.update();

  // renderer.setClearColor(0xAAAAAA);
  // renderer.shadowMap.enabled = true;

  scene = new THREE.Scene();
  // scene.background = new THREE.Color(0xCCCCCC);

  // put the camera on a pole (parent it to an object)
  // so we can spin the pole to move the camera around the scene
  cameraPole = new THREE.Object3D();
  scene.add(cameraPole);
  cameraPole.add(cameras[0].cam);

  // const gui = new GUI();
  // gui.add(camera, 'fov', 1, 180).onChange(updateCamera);
  // const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
  // gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
  // gui.add(minMaxGUIHelper, 'max', 0.1, 1000, 0.1).name('far').onChange(updateCamera);

}

// function updateCamera() {
//   camera.updateProjectionMatrix();
// }

function makeCamera(fov = 40) {
  const aspect = window.innerWidth / window.innerHeight;  // the canvas default
  const zNear = 0.1;
  const zFar = 300;
  return new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
}
