import * as THREE from "three";
export { createMaterial, loader, loadManager, materials, imageMap };

let imageMap, materials, loadManager, loader;

function createMaterial() {
  const material = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
  });

  const hue = Math.random();
  const saturation = 1;
  const luminance = .5;
  material.color.setHSL(hue, saturation, luminance);

  return material;
}

loadManager = new THREE.LoadingManager();
loader = new THREE.TextureLoader(loadManager);
loader.crossOrigin = '';

imageMap = {
  "https://storage.googleapis.com/schau-wien-images/media/sope2.jpg": "https://experiments.schau-wien.at/sophie/"
  "https://storage.googleapis.com/schau-wien-images/media/kiki1.jpg": "https://experiments.schau-wien.at/kiki/"
  "https://storage.googleapis.com/schau-wien-images/media/sopherfugs.jpg": "https://experiments.schau-wien.at/fergus/"
  "https://storage.googleapis.com/schau-wien-images/media/reeks2.jpg": "https://experiments.schau-wien.at/enrique/"
}

materials = []
for (const [key, value] of Object.entries(imageMap)) {
  materials.push(new THREE.MeshPhongMaterial({map: loader.load(key)}))
}
