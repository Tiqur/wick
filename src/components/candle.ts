import * as THREE from 'three';

type OHLC = [number, number, number, number, number];


function setCandleMatrix(matrix: THREE.Matrix4, position = new THREE.Vector3(0, 0, 0), quaternion = new THREE.Quaternion(), scale = new THREE.Vector3(1, 1, 1)) {
  matrix.compose(position, quaternion, scale)
}

function getCandleColor(open: number, close: number) {
  return open < close ? '#d1d4dc' : '#3179f5';
}


// The niave method is good for very dynamic objects, but try not to use it too much
function addDynamicCandle(scene: THREE.Scene, ohlc: OHLC) {

  // Contains entire candle
  const group = new THREE.Group();
  
  // Candle body
  const body_geometry = new THREE.PlaneGeometry(1, 2);
  const body_material = new THREE.MeshBasicMaterial({ color: getCandleColor(ohlc[1], ohlc[4]) });
  const body_mesh = new THREE.Mesh(body_geometry, body_material);
  group.add(body_mesh);

  // Candle wick
  const wick_geometry = new THREE.PlaneGeometry(0.1, 3);
  const wick_material = new THREE.MeshBasicMaterial({ color: getCandleColor(ohlc[1], ohlc[4]) });
  const wick_mesh = new THREE.Mesh(wick_geometry, wick_material);
  group.add(wick_mesh);


  scene.add(group);
}


// These candles are static, meaning they are fast, but cannot change
function addStaticCandles(scene: THREE.Scene, ohlcData: OHLC[]) {
  const count = ohlcData.length;

  // Use as cache as to not create a new object every candle
  const mutableCandleMatrix = new THREE.Matrix4();

  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const mesh = new THREE.InstancedMesh(geometry, material, count) ;

  for (let i = 0; i < count; i++) {
    setCandleMatrix(mutableCandleMatrix, new THREE.Vector3(Math.random()*1, Math.random()*1, Math.random()*1));
    mesh.setMatrixAt(i, mutableCandleMatrix);
  }

  // Makes it so 3js doesn't automatically update the transofrmation matrix
  mesh.matrixAutoUpdate = false;

  scene.add(mesh);
}

export { addStaticCandles, addDynamicCandle, OHLC };
