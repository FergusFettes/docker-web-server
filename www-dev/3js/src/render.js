import { renderer, canvas, cameras, mainCamera, cameraPole, scene } from "src/background.js";
import { imageMap } from "src/material.js";
import { PickHelper } from "src/classes.js";

export {
  render,
  renderObjects,
  resizeRendererToDisplaySize,
  touchListeners,
  elementListeners,
  cubeMap,
};
let renderObjects, chosenOrbit, cubeMap, infoElem, infoElemBottom, pickHelper, pickPosition;

// renderObjects = [];
// chosenOrbit = [];
cubeMap = new WeakMap();
// let rotationActive = true;
// let rotationNotice = "members on the go";

infoElem = document.querySelector('#info');
infoElemBottom = document.querySelector('#info-bottom');

pickPosition = {x: 0, y: 0};
pickHelper = new PickHelper();
clearPickPosition();

let camera = mainCamera
infoElemBottom.textContent = cameras.get(mainCamera);

function render(time) {
  time *= 0.001;

  conditionalPickerResizer(time, camera);

  // renderObjectSet(renderObjects, time);
  cameraPole.rotation.y = time * .1;

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

function conditionalPickerResizer(time, camera) {
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

// function renderObjectSet(objectSet, time) {
//   if (rotationActive) {
//     objectSet.forEach((obj, ndx) => {
//       simpleRotate(obj, ndx, time);
//     });
//   } else {
//     objectSet.forEach((obj, ndx) => {
//       if (obj[0].type === "Mesh") {
//         simpleRotate(obj, ndx, time);
//       } else {
//         haltingRotate(obj, ndx, time);
//       }
//     });
//   }
// }


function simpleRotate(obj, ndx, time) {
    const speed = .1 + ndx * .1;
    const rot = time * obj[1] * speed;
    obj[0].rotation.x = rot;
    obj[0].rotation.y = rot;
}

function haltingRotate(obj, ndx, time) {
  const absoluteRotation = obj[0].rotation.x % ( Math.PI * 2 )
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
    changeCamera();
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
    changeCamera();
  }, {passive: false});
}

function elementListeners() {
  const el1 = document.querySelector(".home-icon")
  el1.addEventListener("click", (event) => {
    camera = mainCamera
    infoElemBottom.textContent = cameras.get(mainCamera);
  })
  const el2 = document.querySelector(".other-icon")
  el2.addEventListener("click", stopWandering)
  const el3 = document.querySelector(".third-icon")
  el3.addEventListener("click", stopWandering)
}

// function stopWandering(event) {
//   console.log(event);
//   if (infoElemBottom.textContent === rotationNotice) {
//     infoElemBottom.textContent = "";
//     rotationActive = false;

  // } else {
  //   infoElemBottom.textContent = rotationNotice;
  //   rotationActive = true;
  // }
// }

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

// function switchGroups(from, to) {
//   if (pickHelper.pickedObject) {
//       from = from.filter((x) => {return !(x[0] === pickHelper.pickedObject.parent)})
//       to.push(pickHelper.pickedObject.parent)
//       const set = new Set(to)
//       to = Array.from(set)
//   }
//   infoElem.textContent = ''
// }

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

function changeCamera() {
  if (pickHelper.pickedObject) {
    camera = pickHelper.pickedObject.children[0]
    infoElemBottom.textContent = cameras.get(pickHelper.pickedObject.children[0]);
  }
}
