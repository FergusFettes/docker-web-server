import * as THREE from 'three';
import { createYouCube } from 'src/youcube.js'
import { controls, scene } from "src/background.js";
import { render } from "src/render.js";


init();
requestAnimationFrame(render);
function init() {

  // const video = '9xhU3sZrpiU'
  // const videos = []
  // for (let i = 0; i < 4; i ++) {
  //   videos.push(video);
  // }

  const logo = 'https://blog.schau-wien.at/wp-content/uploads/2020/04/logo.jpg'
  const logos = []
  for (let i = 0; i < 6; i ++) {
    logos.push(logo);
  }

  const soundcloud = "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/772342537&color=%23ff5500&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=true&visual=true"
  const soundclouds = [];
  for (let i = 0; i < 6; i ++) {
    soundclouds.push(soundcloud);
  }

  {
    const cube = createYouCube(90, 0, 0, 120, 0.8, soundclouds);
    scene.add( cube );
  }

  // {
  //   const cube = createYouCube(-90, 0, 0, 120, 0.8, logos);
  //   scene.add( cube );
  // }

  // {
  //   const cube = createYouCube(0, 90, 0, 120, 0.8, logos);
  //   scene.add( cube );
  // }

  // {
  //   const cube = createYouCube(0, -90, 0, 120, 0.8, logos);
  //   scene.add( cube );
  // }





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
