import * as THREE from 'three';

type OHLC = [number, number, number, number, number];

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

  // Add to scene
  scene.add(group);
}


// These candles are static, meaning they are fast, but cannot change
function addStaticCandles(scene: THREE.Scene, ohlcData: OHLC[]) {
  // Candle count
  const count = ohlcData.length;

  // Cached values to be changed
  const _body = new THREE.Object3D();
  const _wick = new THREE.Object3D();
  const _scale = new THREE.Vector3();

  // Geometry
  const body_geometry = new THREE.PlaneGeometry();
  const body_material = new THREE.MeshBasicMaterial();
  const wick_geometry = new THREE.PlaneGeometry();
  const wick_material = new THREE.MeshBasicMaterial();

  // Mesh
  const bodyMesh = new THREE.InstancedMesh(body_geometry, body_material, count);
  const wickMesh = new THREE.InstancedMesh(wick_geometry, wick_material, count);

  // Init group
  const group = new THREE.Group();

  const colorCache = new THREE.Color();
  ohlcData.forEach((ohlc, index) => {

    // Calculate candle color
    colorCache.set(getCandleColor(ohlc[1], ohlc[4]));

    // Set body and wick color
    bodyMesh.setColorAt(index, colorCache);
    wickMesh.setColorAt(index, colorCache);

    // ---- Body ----
    // Set body height 
    _scale.set(1, 2, 1);
    _body.scale.copy(_scale);

    // Set body location
    _body.position.set(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1);
    _body.updateMatrix();

    // Update body mesh
    bodyMesh.setMatrixAt(index, _body.matrix)

    // ---- Wick ----
    // Set wick height 
    _scale.set(0.1, 4, 1);
    _wick.scale.copy(_scale);

    // Set body location
    _wick.position.set(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1);
    _wick.updateMatrix();

    // Update wick mesh
    wickMesh.setMatrixAt(index, _wick.matrix)
  });

  // Add all candles to scene
  group.add(wickMesh);
  group.add(bodyMesh);
  scene.add(group);
}

export { addStaticCandles, addDynamicCandle, OHLC };
