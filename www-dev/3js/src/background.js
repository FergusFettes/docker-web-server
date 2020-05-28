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

  class DegRadHelper {
    constructor(obj, prop) {
      this.obj = obj;
      this.prop = prop;
    }
    get value() {
      return THREE.MathUtils.radToDeg(this.obj[this.prop]);
    }
    set value(v) {
      this.obj[this.prop] = THREE.MathUtils.degToRad(v);
    }
  }

  {
    // const color = 0xFFFFFF;
    // const intensity = 1;
    // const light = new THREE.DirectionalLight(color, intensity);
    // light.position.set(10, 10, 0);
    // light.target.position.set(-5, 0, 0);
    // scene.add(light);
    // scene.add(light.target);

    // const helper = new THREE.DirectionalLightHelper(light);
    // scene.add(helper);

    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.SpotLight(color, intensity);
    light.position.set(0, 10, 0);
    scene.add(light);

    const helper = new THREE.SpotLightHelper(light);
    scene.add(helper);

    function updateLight() {
      // light.target.updateMatrixWorld();
      helper.update();
    }
    // updateLight();

    const gui = new GUI();
    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('culoure');
    gui.add(light, 'intensity', 0, 2, 0.01);
    gui.add(light, 'distance', 0, 40).onChange(updateLight);
    gui.add(new DegRadHelper(light, 'angle'), 'value', 0, 90).name('angle').onChange(updateLight);
    gui.add(light, 'penumbra', 0, 1, 0.01);

    makeXYZGUI(gui, light.position, 'position', updateLight);
    // makeXYZGUI(gui, light.target.position, 'target', updateLight);
  }

  // {
  //   const skyColor = 0xB1E1FF;  // light blue
  //   const groundColor = 0xB97A20;  // brownish orange
  //   const intensity = 1;
  //   const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
  //   scene.add(light);
  // }

}

function makeCamera(fov = 40) {
  const aspect = 2;  // the canvas default
  const zNear = 0.1;
  const zFar = 1000;
  return new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
}

function makeXYZGUI(gui, vector3, name, onChangeFn) {
  const folder = gui.addFolder(name);
  folder.add(vector3, 'x', -30, 30).onChange(onChangeFn);
  folder.add(vector3, 'y', -30, 30).onChange(onChangeFn);
  folder.add(vector3, 'z', -30, 30).onChange(onChangeFn);
  folder.open();
}
