import * as THREE from 'three';
import { CSSElement } from 'src/classes.js'
import { controls, scene } from "src/background.js";
import { render } from "src/render.js";


init();
requestAnimationFrame(render);
function init() {

  var group = new THREE.Group();
  group.add( new CSSElement( '9xhU3sZrpiU', 240, 0, 0, Math.PI / 2 ) );
  group.add( new CSSElement( '9xhU3sZrpiU', - 240, 0, 0, - Math.PI / 2 ) );
  group.add( new CSSElement( '9xhU3sZrpiU', 0, 0, 240, 0 ) );
  group.add( new CSSElement( '9xhU3sZrpiU', 0, 0, - 240, Math.PI ) );
  group.add( new CSSElement( '9xhU3sZrpiU', 0, 240, 0, 0, Math.PI / 2 ) );
  group.add( new CSSElement( '9xhU3sZrpiU', 0, -240, 0, 0, -Math.PI / 2 ) );
  scene.add( group );

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
