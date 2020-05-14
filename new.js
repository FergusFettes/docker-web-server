import * as THREE from "three";

main();
function main(){
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xAAAAAA)

                                          // fov asp near far
  const camera = new THREE.PerspectiveCamera(40, 2, 1, 1000);
  camera.position.z = 120;

  {
    const color = 0xaFFFAA;
    const intensity = 2;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 4, 4);
    scene.add(light);
  }

  const geometry = new THREE.BoxGeometry(1, 1, 1);

  function makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({color});
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cube.position.x = x;
    return cube;
  }

  const cubes = [
    makeInstance(geometry, 0x44aa88,  0),
    makeInstance(geometry, 0x8844aa, -2),
    makeInstance(geometry, 0xaa8844,  2),
  ];

  function render(time) {
    time *= 0.001;  // convert time to seconds

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * .1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
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
