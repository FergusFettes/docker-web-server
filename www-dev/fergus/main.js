import * as THREE from 'three';
import { createYouCube } from 'src/youcube.js'
import { controls, scene } from "src/background.js";
import { render } from "src/render.js";


init();
requestAnimationFrame(render);
function init() {

  const logo = 'https://blog.schau-wien.at/wp-content/uploads/2020/04/logo.jpg'
  const logos = []
  for (let i = 0; i < 6; i ++) {
    logos.push(logo);
  }

  {
    const cube = createYouCube(0, 0, 0, 40, 0.8, logos, 'image');
    scene.add( cube );
  }

  {
    const cube = createYouCube(50, 50, 0, 20, 1, logos, 'image');
    scene.add( cube );
  }

  {
    const cube = createYouCube(-50, 70, 200, 140, 0.2, logos, 'image');
    scene.add( cube );
  }

  // Block iframe events when dragging mainCamera
  var blocker = document.getElementById( 'blocker' );
  blocker.style.display = 'none';

  controls.addEventListener( 'start', function () {
    blocker.style.display = '';
  } );
  controls.addEventListener( 'end', function () {
    blocker.style.display = 'none';
  } );

}
