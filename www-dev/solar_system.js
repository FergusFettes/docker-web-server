// import * as THREE from "three";
import * as THREE from "./node_modules/three/build/three.min.js";
import {GUI} from "./src/js/third_party/dat-gui.js";
import * as rnd from "./scripts/render.js";
import * as mat from "./scripts/material.js";
import * as hlp from "./scripts/helpers.js";
import { canvas, renderer, camera, scene } from "./scripts/background.js";

init();
function init() {

  const gui = new GUI();

  const objects = [];
  const slow_objects = [];
  const points_collection = [];
  const spread = 15;

  const solarSystem = new THREE.Object3D();
  scene.add(solarSystem);
  slow_objects.push(solarSystem);

  const earthOrbit = new THREE.Object3D();
  earthOrbit.position.x = 15;
  solarSystem.add(earthOrbit);
  slow_objects.push(earthOrbit);

  const moonOrbit = new THREE.Object3D();
  moonOrbit.position.x = 2;
  earthOrbit.add(moonOrbit);
  slow_objects.push(moonOrbit);

  // use just one sphere for everything
  const radius = 1;
  const widthSegments = 6;
  const heightSegments = 6;
  const sphereGeometry = new THREE.SphereBufferGeometry(
      radius, widthSegments, heightSegments);

  const sunMaterial = new THREE.MeshPhongMaterial({emissive: 0xFFFF00});
  const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
  sunMesh.scale.set(5, 5, 5);  // make the sun large
  solarSystem.add(sunMesh);
  slow_objects.push(sunMesh);

  const earthMaterial = new THREE.MeshPhongMaterial({color: 0x2233FF, emissive: 0x112244});
  const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
  earthMesh.position.x = 10;
  earthOrbit.add(earthMesh);
  slow_objects.push(earthMesh);

  const moonMaterial = new THREE.MeshPhongMaterial({color: 0x888888, emissive: 0x222222});
  const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
  moonMesh.scale.set(.5, .5, .5);
  moonOrbit.add(moonMesh);
  slow_objects.push(moonMesh);

  function makeAxisGrid(node, label, units) {
    const helper = new hlp.AxisGridHelper(node, units);
    gui.add(helper, 'visible').name(label);
  }

  makeAxisGrid(solarSystem, 'solarSystem', 25);
  makeAxisGrid(sunMesh, 'sunMesh');
  makeAxisGrid(earthOrbit, 'earthOrbit');
  makeAxisGrid(earthMesh, 'earthMesh');
  makeAxisGrid(moonMesh, 'moonMesh');

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

