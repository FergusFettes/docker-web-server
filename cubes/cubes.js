import * as THREE from 'three';

import Stats from './src/js/libs/stats.min.js';
import { TrackballControls } from './src/js/controls/TrackballControls.js';

let container, stats;
let camera, controls, scene, renderer;
let pickingData = [], pickingTexture, pickingScene;
let highlightBox;

let mouse = new THREE.Vector2();
let offset = new THREE.Vector3( 10, 10, 10 );

init();
animate();

function init() {

  container = document.getElementById( "container" );

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 1000;

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xffffff );

  pickingScene = new THREE.Scene();
  pickingTexture = new THREE.WebGLRenderTarget( 1, 1 );

  scene.add( new THREE.AmbientLight( 0x555555 ) );

  var light = new THREE.SpotLight( 0xffffff, 1.5 );
  light.position.set( 0, 500, 2000 );
  scene.add( light );

  var pickingMaterial = new THREE.MeshBasicMaterial( { vertexColors: true } );
  var defaultMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true, vertexColors: true, shininess: 0	} );

  function applyVertexColors( geometry, color ) {

    var position = geometry.attributes.position;
    var colors = [];

    for ( var i = 0; i < position.count; i ++ ) {

      colors.push( color.r, color.g, color.b );

    }

    geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

  }

  var geometriesDrawn = [];
  var geometriesPicking = [];

  var matrix = new THREE.Matrix4();
  var quaternion = new THREE.Quaternion();
  var color = new THREE.Color();

  for ( var i = 0; i < 1000; i ++ ) {

    var geometry = new THREE.BoxBufferGeometry();

    var position = new THREE.Vector3();
    position.x = Math.random() * 10000 - 5000;
    position.y = Math.random() * 6000 - 3000;
    position.z = Math.random() * 8000 - 4000;

    var rotation = new THREE.Euler();
    rotation.x = Math.random() * 2 * Math.PI;
    rotation.y = Math.random() * 2 * Math.PI;
    rotation.z = Math.random() * 2 * Math.PI;

    var scale = new THREE.Vector3();
    scale.x = Math.random() * 200 + 100;
    scale.y = Math.random() * 200 + 100;
    scale.z = Math.random() * 200 + 100;

    quaternion.setFromEuler( rotation );
    matrix.compose( position, quaternion, scale );

    geometry.applyMatrix4( matrix );

    // give the geometry's vertices a random color, to be displayed

    applyVertexColors( geometry, color.setHex( Math.random() * 0xffffff ) );

    geometriesDrawn.push( geometry );

    geometry = geometry.clone();

    // give the geometry's vertices a color corresponding to the "id"

    applyVertexColors( geometry, color.setHex( i ) );

    geometriesPicking.push( geometry );

    pickingData[ i ] = {

      position: position,
      rotation: rotation,
      scale: scale

    };

  }

  var objects = new THREE.Mesh( geometriesDrawn, defaultMaterial );
  scene.add( objects );

  pickingScene.add( new THREE.Mesh( geometriesPicking, pickingMaterial ) );

  highlightBox = new THREE.Mesh(
    new THREE.BoxBufferGeometry(),
    new THREE.MeshLambertMaterial( { color: 0xffff00 }
    ) );
  scene.add( highlightBox );

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  controls = new TrackballControls( camera, renderer.domElement );
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;

  stats = new Stats();
  container.appendChild( stats.dom );

  renderer.domElement.addEventListener( 'mousemove', onMouseMove );

}

//

function onMouseMove( e ) {

  mouse.x = e.clientX;
  mouse.y = e.clientY;

}

function animate() {

  requestAnimationFrame( animate );

  render();
  stats.update();

}

function pick() {

  //render the picking scene off-screen

  // set the view offset to represent just a single pixel under the mouse

  camera.setViewOffset( renderer.domElement.width, renderer.domElement.height, mouse.x * window.devicePixelRatio | 0, mouse.y * window.devicePixelRatio | 0, 1, 1 );

  // render the scene

  renderer.setRenderTarget( pickingTexture );
  renderer.render( pickingScene, camera );

  // clear the view offset so rendering returns to normal

  camera.clearViewOffset();

  //create buffer for reading single pixel

  var pixelBuffer = new Uint8Array( 4 );

  //read the pixel

  renderer.readRenderTargetPixels( pickingTexture, 0, 0, 1, 1, pixelBuffer );

  //interpret the pixel as an ID

  var id = ( pixelBuffer[ 0 ] << 16 ) | ( pixelBuffer[ 1 ] << 8 ) | ( pixelBuffer[ 2 ] );
  var data = pickingData[ id ];

  if ( data ) {

    //move our highlightBox so that it surrounds the picked object

    if ( data.position && data.rotation && data.scale ) {

      highlightBox.position.copy( data.position );
      highlightBox.rotation.copy( data.rotation );
      highlightBox.scale.copy( data.scale ).add( offset );
      highlightBox.visible = true;

    }

  } else {

    highlightBox.visible = false;

  }

}

function render() {

  controls.update();

  pick();

  renderer.setRenderTarget( null );
  renderer.render( scene, camera );

}
