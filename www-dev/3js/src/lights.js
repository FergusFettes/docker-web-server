import * as THREE from "three";
import {GUI} from 'src/third_party/dat-gui.js';
import { canvas, renderer, camera, scene } from "src/background.js";

export { makeLights };

function makeLights () {
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
    light.power = 800;
    light.decay = 2;
    light.distance = Infinity;
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
    gui.add(light, 'decay', 0, 4, 0.01);
    gui.add(light, 'power', 0, 2000);

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

function makeXYZGUI(gui, vector3, name, onChangeFn) {
  const folder = gui.addFolder(name);
  folder.add(vector3, 'x', -30, 30).onChange(onChangeFn);
  folder.add(vector3, 'y', -30, 30).onChange(onChangeFn);
  folder.add(vector3, 'z', -30, 30).onChange(onChangeFn);
  folder.open();
}
