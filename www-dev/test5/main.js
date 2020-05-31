import * as THREE from "three";
import { canvas, scene, camera } from "src/background.js";
import { PickHelper } from "src/classes.js";
import { resizeRendererToDisplaySize } from "src/render.js";

const pickPosition = {x: 0, y: 0};
const pickHelper = new PickHelper();
const cubeMap = new WeakMap();

const infoElem = document.querySelector('#info');

init();
function init() {
  const renderer = new THREE.WebGLRenderer({canvas});
  scene.background = new THREE.Color('white');

  // put the camera on a pole (parent it to an object)
  // so we can spin the pole to move the camera around the scene
  const cameraPole = new THREE.Object3D();
  scene.add(cameraPole);
  cameraPole.add(camera);

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

  clearPickPosition();

  function render(time) {
    time *= 0.001;  // convert to seconds;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    cameraPole.rotation.y = time * .1;

    pickHelper.pick(pickPosition, scene, camera, time);
    showLink();

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  window.addEventListener('mousemove', setPickPosition);
  window.addEventListener('mouseout', clearPickPosition);
  window.addEventListener('mouseleave', clearPickPosition);
  window.addEventListener('mouseup', (event) => {
    event.preventDefault();
    goToLink();
  }, {passive: false});
  window.addEventListener('touchstart', (event) => {
    // prevent the window from scrolling
    event.preventDefault();
    setPickPosition(event.touches[0]);
  }, {passive: false});
  window.addEventListener('touchmove', (event) => {
    setPickPosition(event.touches[0]);
  });
  window.addEventListener('touchend', goToLink);
}

function getCanvasRelativePosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * canvas.width  / rect.width,
    y: (event.clientY - rect.top ) * canvas.height / rect.height,
  };
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

function clearPickPosition() {
  // unlike the mouse which always has a position
  // if the user stops touching the screen we want
  // to stop picking. For now we just pick a value
  // unlikely to pick something
  pickPosition.x = -100000;
  pickPosition.y = -100000;
}

function setPickPosition(event) {
  const pos = getCanvasRelativePosition(event);
  pickPosition.x = (pos.x / canvas.width ) *  2 - 1;
  pickPosition.y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y
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

function showLink() {
  if (cubeMap.get(pickHelper.pickedObject)) {
      infoElem.textContent = cubeMap.get(pickHelper.pickedObject);
  } else {
      infoElem.textContent = ''
  }
}

function goToLink() {
  if (cubeMap.get(pickHelper.pickedObject)) {
      const link = cubeMap.get(pickHelper.pickedObject);
      window.open(link);
  }
  infoElem.textContent = ''
}
