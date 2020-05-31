import * as THREE from "three";
import { canvas, scene, camera } from "src/background.js";
import { PickHelper } from "src/classes.js";
import { resizeRendererToDisplaySize } from "src/render.js";

const pickPosition = {x: 0, y: 0};
const pickHelper = new PickHelper();
const cubeMap = {null: 'nothing selected', undefined: 'selection gone'}

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
    // console.log(cubeMap[pickHelper.pickedObject])

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  window.addEventListener('mousemove', setPickPosition);
  window.addEventListener('mouseout', clearPickPosition);
  window.addEventListener('mouseleave', clearPickPosition);
  window.addEventListener('mousedown', showLink);
  window.addEventListener('mouseup', goToLink);

  window.addEventListener('touchstart', (event) => {
    // prevent the window from scrolling
    event.preventDefault();
    setPickPosition(event.touches[0]);
  }, {passive: false});
  window.addEventListener('touchmove', (event) => {
    setPickPosition(event.touches[0]);
  });
  window.addEventListener('touchend', clearPickPosition);

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
  if (Math.random() > 0.9) {
    cubeMap[cube] = "https://experiments.schau-wien.at/test3/"
  } else {
    cubeMap[cube] = "https://experiments.schau-wien.at/test1/"
  }
}

function showLink() {
  switch(typeof pickHelper.pickedObject) {
    case "object":
      if (pickHelper.pickedObject === null) {
        console.log("still initializing i guess")
        infoElem.textContent = ''
      } else {
        infoElem.textContent = cubeMap[pickHelper.pickedObject]
      }
      break;
    case "undefined":
      console.log("nothing to see here my old buddy")
      infoElem.textContent = ''
      break;
  }
}
function goToLink() {
  switch(typeof pickHelper.pickedObject) {
    case "object":
      if (pickHelper.pickedObject === null) {
        console.log("shouldnt see this very often methinks")
        infoElem.textContent = ''
      } else {
        const link = cubeMap[pickHelper.pickedObject]
        window.open(link)
      }
      break;
    case "undefined":
      console.log("moved away?")
      infoElem.textContent = ''
      break;
  }
}
