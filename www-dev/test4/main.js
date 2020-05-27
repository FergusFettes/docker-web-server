import * as THREE from "three";
import * as rnd from "src/render.js";
import * as mat from "src/material.js";
import { canvas, renderer, camera, scene } from "src/background.js";

const loadingElem = document.querySelector('#loading');
const progressBarElem = loadingElem.querySelector('.progressbar');

init();
function init() {

  const objects = [];
  const slow_objects = [];
  const points_collection = [];
  const spread = 15;

  for (let i = 0; i < 2; i++){
    function klein(v, u, target) {
      u *= Math.PI;
      v *= 2 * Math.PI;
      u = u * 2;

      let x;
      let z;

      if (u < Math.PI) {
          x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(u) * Math.cos(v);
          z = -8 * Math.sin(u) - 2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);
      } else {
          x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(v + Math.PI);
          z = -8 * Math.sin(u);
      }

      const y = -2 * (1 - Math.cos(u) / 2) * Math.sin(v);

      target.set(x, y, z).multiplyScalar(3);
    }

    const slices = 25;
    const stacks = 25;
    addSolidGeometry((i * 6) - 3, 0, new THREE.ParametricBufferGeometry(klein, slices, stacks), slow_objects);
  }

  for (let i = 0; i < 5; i++) {
    const width = 8;
    const height = 8;
    const depth = 8;
    addSolidGeometry(
      i - 2,
      i - 2,
      new THREE.BoxBufferGeometry(width, height, depth),
      slow_objects);
  }

  for (let i = 0; i < 100; i++) {
    const radius = (Math.sin(i * Math.PI) * 3.5) + 1.75;
    const tube = Math.random(1.5) * 2;
    const radialSegments = 8;
    const tubularSegments = 64;
    const p = 2;
    const q = 3;
    addSolidGeometry(
      (i % 15) - 7,
      (i / 5) - 10,
      new THREE.TorusKnotBufferGeometry(radius, tube, tubularSegments, radialSegments, p, q),
      objects);
  }

  function addSolidGeometry(x, y, geometry, collection) {
    const mesh = new THREE.Mesh(geometry, mat.createMaterial());
    addObject(x, y, mesh, collection);
  }

  function addLineGeometry(x, y, geometry, collection) {
    const material = new THREE.LineBasicMaterial({color: 0x000000});
    const mesh = new THREE.LineSegments(geometry, material);
    addObject(x, y, mesh, collection);
  }

  function addObject(x, y, obj, collection) {
    obj.position.x = x * spread;
    obj.position.y = y * spread;

    scene.add(obj);
    collection.push(obj);
  }

  mat.loadManager.onLoad = () => {
    loadingElem.style.display = 'none';
    const geometry = new THREE.BoxBufferGeometry(18, 18, 18)
    const cube = new THREE.Mesh(geometry, mat.materials);
    addObject(0, 0, cube, slow_objects)
  };

  mat.loadManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) => {
  const progress = itemsLoaded / itemsTotal;
  progressBarElem.style.transform = `scaleX(${progress})`;
  };



  function render(time) {
    time *= 0.001;

    if (rnd.resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    objects.forEach((obj, ndx) => {
      const speed = .1 + ndx * .0005;
      const rot = Math.random() * speed;
      obj.rotation.x = rot;
      obj.rotation.y = rot;
    });

    slow_objects.forEach((obj, ndx) => {
      const speed = .1 + ndx * .1;
      const rot = time * speed;
      obj.rotation.x = rot;
      obj.rotation.y = rot;
    });

    points_collection.forEach((obj, ndx) => {
      const speed = .1 + ndx * .01;
      const rot = time * speed;
      obj.rotation.x = rot;
      obj.rotation.y = rot;
    });

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

