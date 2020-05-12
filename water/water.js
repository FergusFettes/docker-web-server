var THREE = require("three")

import Stats from 'three/examples/js/libs/stats.min.js';
import { GUI } from 'three/examples/js/libs/dat.gui.min.js';

import { OrbitControls } from 'three/examples/js/controls/OrbitControls.js';
import { GPUComputationRenderer } from 'three/examples/js/GPUComputationRenderer.js';
import { SimplexNoise } from 'three/examples/js/SimplexNoise.js';

// Texture width for simulation
var WIDTH = 128;

// Water size in system units
var BOUNDS = 512;
var BOUNDS_HALF = BOUNDS * 0.5;

var container, stats;
var camera, scene, renderer;
var mouseMoved = false;
var mouseCoords = new THREE.Vector2();
var raycaster = new THREE.Raycaster();

var waterMesh;
var meshRay;
var gpuCompute;
var heightmapVariable;
var waterUniforms;
var smoothShader;
var readWaterLevelShader;
var readWaterLevelRenderTarget;
var readWaterLevelImage;
var waterNormal = new THREE.Vector3();

var NUM_SPHERES = 5;
var spheres = [];
var spheresEnabled = true;

var simplex = new SimplexNoise();

init();
animate();

function init() {

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 );
  camera.position.set( 0, 200, 350 );

  scene = new THREE.Scene();

  var sun = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
  sun.position.set( 300, 400, 175 );
  scene.add( sun );

  var sun2 = new THREE.DirectionalLight( 0x40A040, 0.6 );
  sun2.position.set( - 100, 350, - 200 );
  scene.add( sun2 );

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  var controls = new OrbitControls( camera, renderer.domElement );
  controls.minDistance = 100;
  controls.maxDistance = 1000;

  stats = new Stats();
  container.appendChild( stats.dom );

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  document.addEventListener( 'touchstart', onDocumentTouchStart, false );
  document.addEventListener( 'touchmove', onDocumentTouchMove, false );

  document.addEventListener( 'keydown', function ( event ) {

    // W Pressed: Toggle wireframe
    if ( event.keyCode === 87 ) {

      waterMesh.material.wireframe = ! waterMesh.material.wireframe;
      waterMesh.material.needsUpdate = true;

    }

  }, false );

  window.addEventListener( 'resize', onWindowResize, false );


  var gui = new GUI();

  var effectController = {
    mouseSize: 20.0,
    viscosity: 0.98,
    spheresEnabled: spheresEnabled
  };

  var valuesChanger = function () {

    heightmapVariable.material.uniforms[ "mouseSize" ].value = effectController.mouseSize;
    heightmapVariable.material.uniforms[ "viscosityConstant" ].value = effectController.viscosity;
    spheresEnabled = effectController.spheresEnabled;
    for ( var i = 0; i < NUM_SPHERES; i ++ ) {

      if ( spheres[ i ] ) {

        spheres[ i ].visible = spheresEnabled;

      }

    }

  };

  gui.add( effectController, "mouseSize", 1.0, 100.0, 1.0 ).onChange( valuesChanger );
  gui.add( effectController, "viscosity", 0.9, 0.999, 0.001 ).onChange( valuesChanger );
  gui.add( effectController, "spheresEnabled", 0, 1, 1 ).onChange( valuesChanger );
  var buttonSmooth = {
    smoothWater: function () {

      smoothWater();

    }
  };
  gui.add( buttonSmooth, 'smoothWater' );
  initWater();

  createSpheres();

  valuesChanger();

}


function initWater() {

  var materialColor = 0x0040C0;

  var geometry = new THREE.PlaneBufferGeometry( BOUNDS, BOUNDS, WIDTH - 1, WIDTH - 1 );

  // material: make a THREE.ShaderMaterial clone of THREE.MeshPhongMaterial, with customized vertex shader
  var material = new THREE.ShaderMaterial( {
    uniforms: THREE.UniformsUtils.merge( [
      THREE.ShaderLib[ 'phong' ].uniforms,
      {
        "heightmap": { value: null }
      }
    ] ),
    vertexShader: document.getElementById( 'waterVertexShader' ).textContent,
    fragmentShader: THREE.ShaderChunk[ 'meshphong_frag' ]

  } );

  material.lights = true;

  // Material attributes from THREE.MeshPhongMaterial
  material.color = new THREE.Color( materialColor );
  material.specular = new THREE.Color( 0x111111 );
  material.shininess = 50;

  // Sets the uniforms with the material values
  material.uniforms[ "diffuse" ].value = material.color;
  material.uniforms[ "specular" ].value = material.specular;
  material.uniforms[ "shininess" ].value = Math.max( material.shininess, 1e-4 );
  material.uniforms[ "opacity" ].value = material.opacity;

  // Defines
  material.defines.WIDTH = WIDTH.toFixed( 1 );
  material.defines.BOUNDS = BOUNDS.toFixed( 1 );

  waterUniforms = material.uniforms;

  waterMesh = new THREE.Mesh( geometry, material );
  waterMesh.rotation.x = - Math.PI / 2;
  waterMesh.matrixAutoUpdate = false;
  waterMesh.updateMatrix();

  scene.add( waterMesh );

  // THREE.Mesh just for mouse raycasting
  var geometryRay = new THREE.PlaneBufferGeometry( BOUNDS, BOUNDS, 1, 1 );
  meshRay = new THREE.Mesh( geometryRay, new THREE.MeshBasicMaterial( { color: 0xFFFFFF, visible: false } ) );
  meshRay.rotation.x = - Math.PI / 2;
  meshRay.matrixAutoUpdate = false;
  meshRay.updateMatrix();
  scene.add( meshRay );


  // Creates the gpu computation class and sets it up

  gpuCompute = new GPUComputationRenderer( WIDTH, WIDTH, renderer );

  var heightmap0 = gpuCompute.createTexture();

  fillTexture( heightmap0 );

  heightmapVariable = gpuCompute.addVariable( "heightmap", document.getElementById( 'heightmapFragmentShader' ).textContent, heightmap0 );

  gpuCompute.setVariableDependencies( heightmapVariable, [ heightmapVariable ] );

  heightmapVariable.material.uniforms[ "mousePos" ] = { value: new THREE.Vector2( 10000, 10000 ) };
  heightmapVariable.material.uniforms[ "mouseSize" ] = { value: 20.0 };
  heightmapVariable.material.uniforms[ "viscosityConstant" ] = { value: 0.98 };
  heightmapVariable.material.uniforms[ "heightCompensation" ] = { value: 0 };
  heightmapVariable.material.defines.BOUNDS = BOUNDS.toFixed( 1 );

  var error = gpuCompute.init();
  if ( error !== null ) {

      console.error( error );

  }

  // Create compute shader to smooth the water surface and velocity
  smoothShader = gpuCompute.createShaderMaterial( document.getElementById( 'smoothFragmentShader' ).textContent, { smoothTexture: { value: null } } );

  // Create compute shader to read water level
  readWaterLevelShader = gpuCompute.createShaderMaterial( document.getElementById( 'readWaterLevelFragmentShader' ).textContent, {
    point1: { value: new THREE.Vector2() },
    levelTexture: { value: null }
  } );
  readWaterLevelShader.defines.WIDTH = WIDTH.toFixed( 1 );
  readWaterLevelShader.defines.BOUNDS = BOUNDS.toFixed( 1 );

  // Create a 4x1 pixel image and a render target (Uint8, 4 channels, 1 byte per channel) to read water height and orientation
  readWaterLevelImage = new Uint8Array( 4 * 1 * 4 );

  readWaterLevelRenderTarget = new THREE.WebGLRenderTarget( 4, 1, {
    wrapS: THREE.ClampToEdgeWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType,
    stencilBuffer: false,
    depthBuffer: false
  } );

}

function fillTexture( texture ) {

  var waterMaxHeight = 10;

  function noise( x, y ) {

    var multR = waterMaxHeight;
    var mult = 0.025;
    var r = 0;
    for ( var i = 0; i < 15; i ++ ) {

      r += multR * simplex.noise( x * mult, y * mult );
      multR *= 0.53 + 0.025 * i;
      mult *= 1.25;

    }
    return r;

  }

  var pixels = texture.image.data;

  var p = 0;
  for ( var j = 0; j < WIDTH; j ++ ) {

    for ( var i = 0; i < WIDTH; i ++ ) {

      var x = i * 128 / WIDTH;
      var y = j * 128 / WIDTH;

      pixels[ p + 0 ] = noise( x, y );
      pixels[ p + 1 ] = pixels[ p + 0 ];
      pixels[ p + 2 ] = 0;
      pixels[ p + 3 ] = 1;

      p += 4;

    }

  }

}

function smoothWater() {

  var currentRenderTarget = gpuCompute.getCurrentRenderTarget( heightmapVariable );
  var alternateRenderTarget = gpuCompute.getAlternateRenderTarget( heightmapVariable );

  for ( var i = 0; i < 10; i ++ ) {

    smoothShader.uniforms[ "smoothTexture" ].value = currentRenderTarget.texture;
    gpuCompute.doRenderTarget( smoothShader, alternateRenderTarget );

    smoothShader.uniforms[ "smoothTexture" ].value = alternateRenderTarget.texture;
    gpuCompute.doRenderTarget( smoothShader, currentRenderTarget );

  }

}

function createSpheres() {

  var sphereTemplate = new THREE.Mesh( new THREE.SphereBufferGeometry( 4, 24, 12 ), new THREE.MeshPhongMaterial( { color: 0xFFFF00 } ) );

  for ( var i = 0; i < NUM_SPHERES; i ++ ) {

    var sphere = sphereTemplate;
    if ( i < NUM_SPHERES - 1 ) {

      sphere = sphereTemplate.clone();

    }

    sphere.position.x = ( Math.random() - 0.5 ) * BOUNDS * 0.7;
    sphere.position.z = ( Math.random() - 0.5 ) * BOUNDS * 0.7;

    sphere.userData.velocity = new THREE.Vector3();

    scene.add( sphere );

    spheres[ i ] = sphere;

  }

}

function sphereDynamics() {

  var currentRenderTarget = gpuCompute.getCurrentRenderTarget( heightmapVariable );

  readWaterLevelShader.uniforms[ "levelTexture" ].value = currentRenderTarget.texture;

  for ( var i = 0; i < NUM_SPHERES; i ++ ) {

    var sphere = spheres[ i ];

    if ( sphere ) {

      // Read water level and orientation
      var u = 0.5 * sphere.position.x / BOUNDS_HALF + 0.5;
      var v = 1 - ( 0.5 * sphere.position.z / BOUNDS_HALF + 0.5 );
      readWaterLevelShader.uniforms[ "point1" ].value.set( u, v );
      gpuCompute.doRenderTarget( readWaterLevelShader, readWaterLevelRenderTarget );

      renderer.readRenderTargetPixels( readWaterLevelRenderTarget, 0, 0, 4, 1, readWaterLevelImage );
      var pixels = new Float32Array( readWaterLevelImage.buffer );

      // Get orientation
      waterNormal.set( pixels[ 1 ], 0, - pixels[ 2 ] );

      var pos = sphere.position;

      // Set height
      pos.y = pixels[ 0 ];

      // Move sphere
      waterNormal.multiplyScalar( 0.1 );
      sphere.userData.velocity.add( waterNormal );
      sphere.userData.velocity.multiplyScalar( 0.998 );
      pos.add( sphere.userData.velocity );

      if ( pos.x < - BOUNDS_HALF ) {

        pos.x = - BOUNDS_HALF + 0.001;
        sphere.userData.velocity.x *= - 0.3;

      } else if ( pos.x > BOUNDS_HALF ) {

        pos.x = BOUNDS_HALF - 0.001;
        sphere.userData.velocity.x *= - 0.3;

      }

      if ( pos.z < - BOUNDS_HALF ) {

        pos.z = - BOUNDS_HALF + 0.001;
        sphere.userData.velocity.z *= - 0.3;

      } else if ( pos.z > BOUNDS_HALF ) {

        pos.z = BOUNDS_HALF - 0.001;
        sphere.userData.velocity.z *= - 0.3;

      }

    }

  }

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function setMouseCoords( x, y ) {

  mouseCoords.set( ( x / renderer.domElement.clientWidth ) * 2 - 1, - ( y / renderer.domElement.clientHeight ) * 2 + 1 );
  mouseMoved = true;

}

function onDocumentMouseMove( event ) {

  setMouseCoords( event.clientX, event.clientY );

}

function onDocumentTouchStart( event ) {

  if ( event.touches.length === 1 ) {

    event.preventDefault();

    setMouseCoords( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );


  }

}

function onDocumentTouchMove( event ) {

  if ( event.touches.length === 1 ) {

    event.preventDefault();

    setMouseCoords( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );


  }

}

function animate() {

  requestAnimationFrame( animate );

  render();
  stats.update();

}

function render() {

  // Set uniforms: mouse interaction
  var uniforms = heightmapVariable.material.uniforms;
  if ( mouseMoved ) {

    raycaster.setFromCamera( mouseCoords, camera );

    var intersects = raycaster.intersectObject( meshRay );

    if ( intersects.length > 0 ) {

        var point = intersects[ 0 ].point;
        uniforms[ "mousePos" ].value.set( point.x, point.z );

    } else {

        uniforms[ "mousePos" ].value.set( 10000, 10000 );

    }

    mouseMoved = false;

  } else {

    uniforms[ "mousePos" ].value.set( 10000, 10000 );

  }

  // Do the gpu computation
  gpuCompute.compute();

  if ( spheresEnabled ) {

    sphereDynamics();

  }

  // Get compute output in custom uniform
  waterUniforms[ "heightmap" ].value = gpuCompute.getCurrentRenderTarget( heightmapVariable ).texture;

  // Render
  renderer.render( scene, camera );

}
