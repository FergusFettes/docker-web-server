import * as THREE from 'three';
import { CSS3DObject } from 'src/third_party/CSS3DRenderer.js';
export { CSSYoutubeElement, createYouCube }

const types = {
  'audio': CSSAudioElement,
  'image': CSSImageElement,
  'youtube': CSSYoutubeElement,
  'soundcloud': CSSSoundcloudElement,
}

function createYouCube(x, y, z, size, fill, content, type) {
  let group = new THREE.Group();
  const orientations = createOrientations(size);
  for (let i = 0; i < content.length; i++) {
    group.add( types[type]( content[i], orientations[i], size, fill) );
  }
  group.position.set(x, y, z)
  return group;
}

function createOrientations (size, polarity = 1) {
  const half = size / 2;
  const orientations = [
    {x: -half, y: 0, z: 0, ry: -Math.PI / 2 * polarity, rx: 0},
    {x: half, y: 0, z: 0, ry: Math.PI / 2 * polarity, rx: 0},
    {x: 0, y: 0, z: -half, ry: 0, rx: 0},
    {x: 0, y: 0, z: half, ry: Math.PI, rx: 0},
    {x: 0, y: -half, z: 0, ry: 0, rx: -Math.PI / 2 * polarity},
    {x: 0, y: half, z: 0, ry: 0, rx: Math.PI / 2 * polarity},
  ];
  return orientations
}

function CSSYoutubeElement ( id, orientation, size, fill) {

  const width = Math.floor(size * fill);
  const height = Math.floor(width * (2 / 3));

  var div = document.createElement( 'div' );
  div.style.width = `${width}px`;
  div.style.height = `${height}px`;
  div.style.backgroundColor = '#000';

  var iframe = document.createElement( 'iframe' );
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = '0px';
  iframe.src = [ 'https://www.youtube.com/embed/', id, '?rel=0' ].join( '' );
  div.appendChild( iframe );

  var object = new CSS3DObject( div );
  object.position.set( orientation["x"], orientation["y"], orientation["z"] );
  object.rotation.y = orientation["ry"];
  object.rotation.x = orientation["rx"];

  return object;
};

function CSSSoundcloudElement ( id, orientation, size, fill) {

  const width = Math.floor(size * fill);
  const height = Math.floor(width * (2 / 3));

  var div = document.createElement( 'div' );
  div.style.width = `${width}px`;
  div.style.height = `${height}px`;
  div.style.backgroundColor = '#000';

  var iframe = document.createElement( 'iframe' );
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = '0px';
  iframe.src = id;
  div.appendChild( iframe );

  var object = new CSS3DObject( div );
  object.position.set( orientation["x"], orientation["y"], orientation["z"] );
  object.rotation.y = orientation["ry"];
  object.rotation.x = orientation["rx"];

  return object;
};

function CSSImageElement ( id, orientation, size, fill) {

  const width = Math.floor(size * fill);

  var div = document.createElement( 'div' );
  div.style.width = `${width}px`;
  div.style.height = `${width}px`;
  div.style.backgroundColor = '#000';
  div.style.background = `url('${id}') 0 0 / 100% auto`;

  var object = new CSS3DObject( div );
  object.position.set( orientation["x"], orientation["y"], orientation["z"] );
  object.rotation.y = orientation["ry"];
  object.rotation.x = orientation["rx"];

  return object;
};

function CSSAudioElement ( id, orientation, size, fill) {

  const width = Math.floor(size * fill);

  var audio = document.createElement( 'AUDIO' );
  audio.style.width = `${width}px`;
  audio.controls = true;
  audio.src = id;

  var object = new CSS3DObject( audio );
  object.position.set( orientation["x"], orientation["y"], orientation["z"] );
  object.rotation.y = orientation["ry"];
  object.rotation.x = orientation["rx"];

  return object;
};

