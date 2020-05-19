import * as THREE from "three";
export { loader, canvas, renderer, camera, scene, makeCamera };

let canvas, renderer, camera, scene, loader;

makeBackground();
function makeBackground() {

  loader = new THREE.TextureLoader();
  canvas = document.querySelector('#c');
  renderer = new THREE.WebGLRenderer({canvas});

  renderer.setClearColor(0xAAAAAA);
  renderer.shadowMap.enabled = true;

  camera = makeCamera();
  camera.position.set(8, 4, 10).multiplyScalar(3);
  camera.lookAt(0, 0, 0);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xCCCCCC);

  {
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 20, 0);
    scene.add(light);
    light.castShadow = true;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;

    const d = 50;
    light.shadow.camera.left = -d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = -d;
    light.shadow.camera.near = 1;
    light.shadow.camera.far = 50;
    light.shadow.bias = 0.001;
  }
  {
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 2, 4);
    scene.add(light);
  }

  const groundGeometry = new THREE.PlaneBufferGeometry(50, 50);
  const groundMaterial = new THREE.MeshPhongMaterial({color: 0xCC8866});
  const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
  groundMesh.rotation.x = Math.PI * -.5;
  groundMesh.receiveShadow = true;
  scene.add(groundMesh);


  // standard lighting?
  // {
  //   const color = 0xFFFFFF;
  //   const intensity = 1;
  //   const light = new THREE.DirectionalLight(color, intensity);
  //   light.position.set(-1, 2, 4);
  //   scene.add(light);
  // }
  // {
  //   const color = 0xFFFFFF;
  //   const intensity = 1;
  //   const light = new THREE.DirectionalLight(color, intensity);
  //   light.position.set(1, -2, -4);
  //   scene.add(light);
  // }
  // {
  //   const color = 0xFFFFFF;
  //   const intensity = 3;
  //   const light = new THREE.PointLight(color, intensity);
  //   scene.add(light);
  // }

}

function makeCamera(fov = 40) {
  const aspect = 2;  // the canvas default
  const zNear = 0.1;
  const zFar = 1000;
  return new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
}
