import * as THREE from "three";
// import {GUI} from 'src/third_party/dat-gui.js';
import { CSS3DRenderer } from 'src/third_party/CSS3DRenderer.js';
import {OrbitControls} from 'src/js/OrbitControls.js';
// import { TrackballControls } from 'src/js/TrackballControls.js';
import { MinMaxGUIHelper } from "src/classes.js";

export { canvas, container, renderer, mainCamera, cameras, cameraPole, scene, gui, makeCamera, controls };
let canvas, container, renderer, mainCamera, cameras, cameraPole, scene, controls, gui;

// gui = new GUI();

makeBackground();
function makeBackground() {

  // canvas = document.querySelector('#c');
  // renderer = new THREE.WebGLRenderer({canvas, alpha: true});
  // renderer.physicallyCorrectLights = true;

  container = document.getElementById( 'container' );

  renderer = new CSS3DRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  mainCamera = makeCamera(80);
  mainCamera.position.set(70, 70, 70).multiplyScalar(3);
  // mainCamera.position.set(0, 0, 50).multiplyScalar(3);
  // mainCamera.lookAt(0, 0, 0);
  cameras = new WeakMap();
  cameras.set(mainCamera, 'main camera')

  controls = new OrbitControls( mainCamera, renderer.domElement );
  controls.rotateSpeed = 4;

  // controls = new OrbitControls(mainCamera, canvas);
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
  cameraPole.add(mainCamera);

  // const gui = new GUI();
  // gui.add(mainCamera, 'fov', 1, 180).onChange(updateCamera);
  // const minMaxGUIHelper = new MinMaxGUIHelper(mainCamera, 'near', 'far', 0.1);
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
