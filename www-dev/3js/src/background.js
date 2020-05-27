import * as THREE from "three";
import {OrbitControls} from 'src/js/OrbitControls.js';
import {GUI} from 'src/third_party/dat-gui.js';
export { canvas, renderer, camera, scene };

let canvas, renderer, camera, scene, controls;

makeBackground();
function makeBackground() {

  canvas = document.querySelector('#c');
  renderer = new THREE.WebGLRenderer({canvas});

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

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.AmbientLight(color, intensity);
    scene.add(light);
  }

  const skyColor = 0xB1E1FF;  // light blue
  const groundColor = 0xB97A20;  // brownish orange
  const intensity = 1;
  const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
  scene.add(light);

  const gui = new GUI();
  gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('skyColor');
  gui.addColor(new ColorGUIHelper(light, 'groundColor'), 'value').name('groundColor');
  gui.add(light, 'intensity', 0, 2, 0.01);

}

function makeCamera(fov = 40) {
  const aspect = 2;  // the canvas default
  const zNear = 0.1;
  const zFar = 1000;
  return new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
}
