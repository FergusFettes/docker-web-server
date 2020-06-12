import * as THREE from 'three';
import { createYouCube } from 'src/youcube.js'
import { controls, scene } from "src/background.js";
import { render } from "src/render.js";


init();
requestAnimationFrame(render);
function init() {

  const video = '9xhU3sZrpiU'
  const videos = []
  for (let i = 0; i < 4; i ++) {
    videos.push(video);
  }

  {
    const cube = createYouCube(0, 0, 0, 480, 1, videos)
    scene.add( cube );
  }

  // {
  //   const cube = createYouCube(-100, 0, 0, 480, 0, videos)
  //   scene.add( cube );
  // }

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
