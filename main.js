import * as THREE from "three";
function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});

  const fov = 40;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 120;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xCCCCCC);

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }
  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(1, -2, -4);
    scene.add(light);
  }

  const objects = [];
  const spread = 15;

  function addObject(x, y, obj) {
    obj.position.x = x * spread;
    obj.position.y = y * spread;

    scene.add(obj);
    objects.push(obj);
  }

  function createMaterial() {
    const material = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
    });

    const hue = Math.random();
    const saturation = 1;
    const luminance = .5;
    material.color.setHSL(hue, saturation, luminance);

    return material;
  }

  function addSolidGeometry(x, y, geometry) {
    const mesh = new THREE.Mesh(geometry, createMaterial());
    addObject(x, y, mesh);
  }

  function addLineGeometry(x, y, geometry) {
    const material = new THREE.LineBasicMaterial({color: 0x000000});
    const mesh = new THREE.LineSegments(geometry, material);
    addObject(x, y, mesh);
  }

  for (let i = 0; i < 100; i++) {
    const radius = (Math.sin(i * Math.PI) * 3.5) + 1.75;
    const tube = Math.random(1.5) * 2;
    const radialSegments = 8;
    const tubularSegments = 64;
    const p = 2;
    const q = 3;
    addSolidGeometry((i % 15) - 7, (i / 5) - 10, new THREE.TorusKnotBufferGeometry(radius, tube, tubularSegments, radialSegments, p, q));
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

  function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
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

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
