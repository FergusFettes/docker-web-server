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
let renderObjects, cubeMap, isSetActive, infoElem, infoElemBottom, pickHelper, pickPosition;

renderObjects = [];
cubeMap = new WeakMap();

isSetActive = {renderObjects: true};

infoElem = document.querySelector('#info');
infoElemBottom = document.querySelector('#info-bottom');

pickPosition = {x: 0, y: 0};
pickHelper = new PickHelper();

function render(time) {
  time *= 0.001;
  conditionalPickerResizer(time);

  renderObjectSet(renderObjects, time);
  // cameraPole.rotation.y = time * .1;

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

function conditionalPickerResizer(time) {
  if (pickHelper) {
    pickHelper.pick(pickPosition, scene, camera, time);
    showLink();
  }
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
}

function renderObjectSet(objectSet, time) {
  if (isSetActive[objectSet]) {
    objectSet.forEach((obj, ndx) => {
      simpleRotate(obj, ndx, time);
    });
  } else {
    objectSet.forEach((obj, ndx) => {
      if (obj[0].type === "Mesh") {
        simpleRotate(obj, ndx, time);
      } else {
        haltingRotate(obj, ndx, time);
      }
    });
  }
}

function simpleRotate(obj, ndx, time) {
    const speed = .1 + ndx * .1;
    const rot = time * obj[1] * speed;
    obj[0].rotation.x = rot;
    obj[0].rotation.y = rot;
}

function haltingRotate(obj, ndx, time) {
  const absoluteRotation = obj[0].rotation % ( Math.PI * 2 )
  if (absoluteRotation > 0.2) {
    const speed = .1 + ndx * .1;
    const rot = time * obj[1] * speed;
    obj[0].rotation.x = rot;
    obj[0].rotation.y = rot;
  }
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
  el1.addEventListener("click", startTransition)
  const el2 = document.querySelector(".third-icon")
  el2.addEventListener("click", startTransition)
}

function startTransition(event) {
  console.log(event)
  infoElemBottom.textContent = "clickity click"
  isSetActive[renderObjects] = false;
}

function clearPickPosition() {
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
