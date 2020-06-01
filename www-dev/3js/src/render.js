import { renderer, camera, scene } from "src/background.js";

export { render, renderObjects, resizeRendererToDisplaySize };

const renderObjects = [];

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

