import { renderer, canvas, camera, cameraPole, scene } from "src/background.js";
import { imageMap } from "src/material.js";
import { PickHelper } from "src/classes.js";

export {
  render,
  renderObjects,
  resizeRendererToDisplaySize,
  touchListeners,
  elementListeners,
  cubeMap,
  clearPickPosition,
};
let renderObjects, cubeMap, infoElem, pickHelper, pickPosition;

renderObjects = [];
cubeMap = new WeakMap();
infoElem = document.querySelector('#info');

pickPosition = {x: 0, y: 0};
pickHelper = new PickHelper();

function render(time) {
  time *= 0.001;

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  renderObjects.forEach((obj, ndx) => {
    const speed = .1 + ndx * .1;
    const rot = time * obj[1] * speed;
    obj[0].rotation.x = rot;
    obj[0].rotation.y = rot;
  });

  // cameraPole.rotation.y = time * .1;

  if (pickHelper) {
    pickHelper.pick(pickPosition, scene, camera, time);
    showLink();
  }

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

function touchListeners() {
  window.addEventListener('mousemove', setPickPosition);
  window.addEventListener('mouseout', clearPickPosition);
  window.addEventListener('mouseleave', clearPickPosition);
  window.addEventListener('mouseup', (event) => {
    event.preventDefault();
    clearPickPosition();
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
  window.addEventListener('touchend', (event) => {
    clearPickPosition();
    goToLink();
  }, {passive: false});
}

function elementListeners() {
  const el1 = document.querySelector(".other-icon")
  el1.addEventListener("click", startTransition, false)
}

function startTransition(event) {
  console.log(event);
  bringForward();
}

function bringForward () {
  infoElem.textContent = "bringing forward my friend"
  console.log('deeper test')
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

function getCanvasRelativePosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * canvas.width  / rect.width,
    y: (event.clientY - rect.top ) * canvas.height / rect.height,
  };
}

function showLink() {
  if (pickHelper.pickedObject) {
      infoElem.textContent = imageMap.get(pickHelper.pickedObject.material);
  } else {
      infoElem.textContent = ''
  }
}

function goToLink() {
  if (pickHelper.pickedObject) {
      const link = imageMap.get(pickHelper.pickedObject.material);
      window.open(link);
  }
  infoElem.textContent = ''
}
