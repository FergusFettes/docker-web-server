import * as THREE from "three";
export { createMaterial, loader, loadManager, materials };

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

const loadManager = new THREE.LoadingManager();
const loader = new THREE.TextureLoader(loadManager);
loader.crossOrigin = ''

const materials = [
  new THREE.MeshBasicMaterial({map: loader.load('https://storage.cloud.google.com/schau-wien-images/media/sopherfugs.jpg')}),
  new THREE.MeshBasicMaterial({map: loader.load('https://storage.cloud.google.com/schau-wien-images/media/kiki1.jpg')}),
  new THREE.MeshBasicMaterial({map: loader.load('https://storage.cloud.google.com/schau-wien-images/media/sopherfugs.jpg')}),
  new THREE.MeshBasicMaterial({map: loader.load('https://storage.cloud.google.com/schau-wien-images/media/kiki1.jpg')}),
  new THREE.MeshBasicMaterial({map: loader.load('https://storage.cloud.google.com/schau-wien-images/media/sopherfugs.jpg')}),
  new THREE.MeshBasicMaterial({map: loader.load('https://storage.cloud.google.com/schau-wien-images/media/kiki1.jpg')})
];
