import * as THREE from "three";
import { canvas, scene, camera } from "src/background.js";
import { render, cubeMap, touchListeners, clearPickPosition } from "src/render.js";


init();
touchListeners();
function init() {
  const renderer = new THREE.WebGLRenderer({canvas});
  scene.background = new THREE.Color('white');

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    camera.add(light);
  }

  const geometry = new THREE.BoxGeometry(1, 1, 1);

  const numObjects = 400;
  for (let i = 0; i < numObjects; ++i) {
    const material = new THREE.MeshPhongMaterial({
      color: randomColor(),
    });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const point = getPoint();
    cube.position.set(point["x"] * 60, point["y"] * 60, point["z"] * 60);
    cube.rotation.set(rand(Math.PI), rand(Math.PI), 0);
    cube.scale.set(rand(3, 6), rand(3, 6), rand(3, 6));

    mapCube(cube);
  }

  requestAnimationFrame(render);
}


function rand(min, max) {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return min + (max - min) * Math.random();
}

function getPoint() {
  let d, x, y, z;
  do {
      x = Math.random() * 2.0 - 1.0;
      y = Math.random() * 2.0 - 1.0;
      z = Math.random() * 2.0 - 1.0;
      d = x*x + y*y + z*z;
  } while(d > 1.0);
  return {x: x, y: y, z: z};
}

function randomColor() {
  return `hsl(${rand(360) | 0}, ${rand(50, 100) | 0}%, 50%)`;
}

function mapCube(cube) {
  const choice = Math.floor(Math.random() * 4)
  switch(choice) {
    case 0:
      cubeMap.set(cube, "https://experiments.schau-wien.at/test1/")
      break;
    case 1:
      cubeMap.set(cube, "https://experiments.schau-wien.at/test2/")
      break;
    case 2:
      cubeMap.set(cube, "https://experiments.schau-wien.at/test3/")
      break;
    case 3:
      cubeMap.set(cube, "https://experiments.schau-wien.at/test4/")
      break;
  }
}
