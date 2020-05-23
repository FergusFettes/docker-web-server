import * as THREE from "three";
import * as rnd from "./src/render.js";
import * as mat from "./src/material.js";
import { canvas, renderer, camera, scene } from "./src/background.js";

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

  for (let i = 0; i < 32; i++) {
    const radius = 15;
    const canvas = renderer.domElement;
    const w = canvas.clientWidth - (canvas.clientWidth / 5) ;
    const h = canvas.clientHeight;
    addSolidGeometry(
      (i / w) * 0.8,
      (i / 3) - 2,
      new THREE.IcosahedronBufferGeometry(radius),
      slow_objects);
  }

  for (var i = 0; i < 4; i++) {
    const radius = 150;
    const widthSegments = 12;
    const heightSegments = 8;
    const geometry = new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments);
    const material = new THREE.PointsMaterial({
        color: Math.random(),
        size: 5,     // in world units
    });
    const points = new THREE.Points(geometry, material);
    points.position.set(-1, -2, -4);
    scene.add(points);
    points_collection.push(points);
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

