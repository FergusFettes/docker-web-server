import * as THREE from 'three';
import { createYouCube } from 'src/youcube.js'
import { controls, cssRenderer, scene, makeCameraControls } from "src/background.js";
import { render, renderObjects } from "src/render.js";
import { createMaterial } from "src/material.js";

const spread = 80;

init();
requestAnimationFrame(render);
function init() {

  for (let i = 0; i < 5; i++) {
    const width = 8;
    const height = 8;
    const depth = 8;
    addSolidGeometry(
      i - 2,
      i - 2,
      new THREE.BoxBufferGeometry(width, height, depth),
      renderObjects);
  }

  const logo = 'https://blog.schau-wien.at/wp-content/uploads/2020/04/logo.jpg'
  const logos = []
  for (let i = 0; i < 6; i ++) {
    logos.push(logo);
  }


  const cube = createYouCube(0, 0, 0, 40, 0.8, logos, 'image');
  scene.add( cube );
  const cameraControls = makeCameraControls(cssRenderer.domElement);
  cube.add(cameraControls.camera);


  // {
  //   const cube = createYouCube(50, 50, 0, 20, 1, logos, 'image');
  //   scene.add( cube );
  // }

  // {
  //   const cube = createYouCube(-50, 70, 200, 140, 0.2, logos, 'image');
  //   scene.add( cube );
  // }
}

function addSolidGeometry(x, y, geometry, collection) {
  const mesh = new THREE.Mesh(geometry, createMaterial());
  addObject(x, y, mesh, collection);
}

function addObject(x, y, obj, collection) {
  obj.position.x = x * spread;
  obj.position.y = y * spread;

  scene.add(obj);
  collection.push(obj);
}
