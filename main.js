import * as THREE from "three";
import * as rnd from "./scripts/render.js";
import * as mat from "./scripts/material.js";
import { canvas, renderer, camera, scene } from "./scripts/background.js";

init();
function init() {

  const objects = [];
  const slow_objects = [];
  const spread = 15;


  for (let i = 0; i < 100; i++) {
    const radius = (Math.sin(i * Math.PI) * 3.5) + 1.75;
    const tube = Math.random(1.5) * 2;
    const radialSegments = 8;
    const tubularSegments = 64;
    const p = 2;
    const q = 3;
    addSolidGeometry((i % 15) - 7, (i / 5) - 10, new THREE.TorusKnotBufferGeometry(radius, tube, tubularSegments, radialSegments, p, q), objects);
  }

  for (let i = 0; i < 32; i++) {
    const radius = 15;
    const canvas = renderer.domElement;
    const w = canvas.clientWidth - (canvas.clientWidth / 5) ;
    const h = canvas.clientHeight;
    addSolidGeometry((i / w) * 0.8, (i / 3) - 2, new THREE.IcosahedronBufferGeometry(radius), slow_objects);
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
    objects.push(points);
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

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

