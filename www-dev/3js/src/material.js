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
loader.crossOrigin = '';

const materials = [
  new THREE.MeshPhongMaterial({map: loader.load('https://storage.googleapis.com/schau-wien-images/media/sope2.jpg')}),
  new THREE.MeshPhongMaterial({map: loader.load('https://storage.googleapis.com/schau-wien-images/media/kiki1.jpg')}),
  new THREE.MeshPhongMaterial({map: loader.load('https://storage.googleapis.com/schau-wien-images/media/sopherfugs.jpg')}),
  new THREE.MeshPhongMaterial({map: loader.load('https://storage.googleapis.com/schau-wien-images/media/reeks2.jpg')}),
];
