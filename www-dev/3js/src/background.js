import * as THREE from "three";
import {OrbitControls} from 'src/js/OrbitControls.js';
export { canvas, renderer, camera, scene };

let canvas, renderer, camera, scene;

makeBackground();
function makeBackground() {

  canvas = document.querySelector('#c');
  renderer = new THREE.WebGLRenderer({canvas});

  camera = makeCamera();
  camera.position.set(1, 2, 20).multiplyScalar(3);
  camera.lookAt(0, 0, 0);

  controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();

  renderer.setClearColor(0xAAAAAA);
  renderer.shadowMap.enabled = true;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xCCCCCC);

  // {
  //   const color = 0xFFFFFF;
  //   const intensity = 1;
  //   const light = new THREE.DirectionalLight(color, intensity);
  //   light.position.set(-1, 2, 4);
  //   scene.add(light);
  // }
  // {
  //   const color = 0xFFFFFF;
  //   const intensity = 1;
  //   const light = new THREE.DirectionalLight(color, intensity);
  //   light.position.set(1, -2, -4);
  //   scene.add(light);
  // }

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.AmbientLight(color, intensity);
    scene.add(light);
  }

  {
    const gui = new GUI();
    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
    gui.add(light, 'intensity', 0, 2, 0.01);
  }
}

function makeCamera(fov = 40) {
  const aspect = 2;  // the canvas default
  const zNear = 0.1;
  const zFar = 1000;
  return new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
}

class ColorGUIHelper {
  constructor(object, prop) {
    this.object = object;
    this.prop = prop;
  }
  get value() {
    return `#${this.object[this.prop].getHexString()}`;
  }
  set value(hexString) {
    this.object[this.prop].set(hexString);
  }
}
