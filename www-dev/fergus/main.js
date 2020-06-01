import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'src/third_party/CSS3DRenderer.js';
import { TrackballControls } from 'src/js/TrackballControls.js';

var camera, scene, renderer;
var controls;

var Element = function ( id, x, y, z, ry ) {

  var div = document.createElement( 'div' );
  div.style.width = '480px';
  div.style.height = '360px';
  div.style.backgroundColor = '#000';

  var iframe = document.createElement( 'iframe' );
  iframe.style.width = '480px';
  iframe.style.height = '360px';
  iframe.style.border = '0px';
  iframe.src = [ 'https://www.youtube.com/embed/', id, '?rel=0' ].join( '' );
  div.appendChild( iframe );

  var object = new CSS3DObject( div );
  object.position.set( x, y, z );
  object.rotation.y = ry;

  return object;

};

init();
animate();

function init() {

  var container = document.getElementById( 'container' );

  camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 5000 );
  camera.position.set( 100, 100, 750 );

  scene = new THREE.Scene();

  renderer = new CSS3DRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  var group = new THREE.Group();
  group.add( new Element( '9xhU3sZrpiU', 0, 0, 240, 0 ) );
  group.add( new Element( '9xhU3sZrpiU', 240, 0, 0, Math.PI / 2 ) );
  group.add( new Element( '9xhU3sZrpiU', 0, 0, - 240, Math.PI ) );
  group.add( new Element( '9xhU3sZrpiU', - 240, 0, 0, - Math.PI / 2 ) );
  scene.add( group );

  controls = new TrackballControls( camera, renderer.domElement );
  controls.rotateSpeed = 4;

  window.addEventListener( 'resize', onWindowResize, false );

  // Block iframe events when dragging camera
  var blocker = document.getElementById( 'blocker' );
  blocker.style.display = 'none';

  controls.addEventListener( 'start', function () {
    blocker.style.display = '';
  } );
  controls.addEventListener( 'end', function () {
    blocker.style.display = 'none';
  } );

}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
  requestAnimationFrame( animate );
  controls.update();
  renderer.render( scene, camera );
}
