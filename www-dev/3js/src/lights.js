import * as THREE from "three";
import { DegRadHelper, ColorGUIHelper } from "src/classes.js";
import { canvas, renderer, camera, scene, gui } from "src/background.js";

export { makeLights };

function makeLights () {

  {
    // Ambient
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.AmbientLight(color, intensity);
    scene.add(light);

    // gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
    // gui.add(light, 'intensity', 0, 2, 0.01);

  }

   // {
   //   // Directional
   //   const color = 0xFFFFFF;
   //   const intensity = 1;
   //   const light = new THREE.DirectionalLight(color, intensity);
   //   light.position.set(10, 10, 0);
   //   light.target.position.set(-5, 0, 0);
   //   scene.add(light);
   //   scene.add(light.target);

   //   const helper = new THREE.DirectionalLightHelper(light);
   //   scene.add(helper);

   //   gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('culoure');
   //   gui.add(light, 'intensity', 0, 2, 0.01);

   //   makeXYZGUI(gui, light.position, 'position', updateLight);
   //   makeXYZGUI(gui, light.target.position, 'target', updateLight);
   // }

  // {
  //   // Spotlight
  //   const color = 0xFFFFFF;
  //   const intensity = 1;
  //   const light = new THREE.SpotLight(color, intensity);
  //   light.position.set(0, 10, 0);
  //   light.power = 800;
  //   light.decay = 2;
  //   light.distance = Infinity;
  //   scene.add(light);

  //   const helper = new THREE.SpotLightHelper(light);
  //   scene.add(helper);

  //   gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('culoure');
  //   gui.add(light, 'intensity', 0, 2, 0.01);
  //   gui.add(light, 'power', 0, 2000);
  //   gui.add(light, 'distance', 0, 40).onChange(updateLight);
  //   gui.add(new DegRadHelper(light, 'angle'), 'value', 0, 90).name('angle').onChange(updateLight);
  //   gui.add(light, 'penumbra', 0, 1, 0.01);
  //   gui.add(light, 'decay', 0, 4, 0.01);

  //   makeXYZGUI(gui, light.position, 'position', updateLight);
  // }

  // {
  //   const skyColor = 0xB1E1FF;  // light blue
  //   const groundColor = 0xB97A20;  // brownish orange
  //   const intensity = 1;
  //   const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
  //   scene.add(light);

  //   gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('skyColor');
  //   gui.addColor(new ColorGUIHelper(light, 'groundColor'), 'value').name('groundColor');
  //   gui.add(light, 'intensity', 0, 2, 0.01);
  // }

}

function updateLight(light) {
  light.target.updateMatrixWorld();
  helper.update();
}

function makeXYZGUI(gui, vector3, name, onChangeFn) {
  const folder = gui.addFolder(name);
  folder.add(vector3, 'x', -30, 30).onChange(onChangeFn);
  folder.add(vector3, 'y', -30, 30).onChange(onChangeFn);
  folder.add(vector3, 'z', -30, 30).onChange(onChangeFn);
  folder.open();
}
