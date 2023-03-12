import * as THREE from 'three';
import priceToNDC from '../systems/priceToNDC';
import ChartSettings from '../systems/chartSettings';

type OHLC = [number, number, number, number, number];


// The niave method is good for very dynamic objects, but try not to use it too much
function addDynamicCandle(scene: THREE.Scene, ohlc: OHLC, settings: ChartSettings) {

  // Contains entire candle
  const group = new THREE.Group();

  const index = 0;

  // Calculate candle body and height
  const body_height = Math.max(Math.abs(priceToNDC(ohlc[1], settings.minPrice, settings.maxPrice, settings.coordinateDelta)-priceToNDC(ohlc[4], settings.minPrice, settings.maxPrice, settings.coordinateDelta)), settings.minHeight);
  const wick_height = Math.abs(priceToNDC(ohlc[2], settings.minPrice, settings.maxPrice, settings.coordinateDelta)-priceToNDC(ohlc[3], settings.minPrice, settings.maxPrice, settings.coordinateDelta));
  const candle_type = ohlc[1] < ohlc[4];
  const candle_color = candle_type ? settings.upColor : settings.downColor;
  
  // Candle body
  const body_geometry = new THREE.PlaneGeometry(settings.bodyWidth, body_height);
  const body_material = new THREE.MeshBasicMaterial({ color: candle_color });
  const body_mesh = new THREE.Mesh(body_geometry, body_material);
  body_mesh.position.setY(priceToNDC(candle_type ? ohlc[1] : ohlc[4], settings.minPrice, settings.maxPrice, settings.coordinateDelta)+body_height/2)
  body_mesh.position.setX(-index*(settings.candleSpacing+settings.bodyWidth))
  group.add(body_mesh);

  // Candle wick
  const wick_geometry = new THREE.PlaneGeometry(settings.wickWidth, wick_height);
  const wick_material = new THREE.MeshBasicMaterial({ color: candle_color });
  const wick_mesh = new THREE.Mesh(wick_geometry, wick_material);
  wick_mesh.position.setY(priceToNDC(ohlc[2], settings.minPrice, settings.maxPrice, settings.coordinateDelta)-wick_height/2)
  wick_mesh.position.setX(-index*(settings.candleSpacing+settings.bodyWidth))
  group.add(wick_mesh);

  // Add to scene
  scene.add(group);
}


// These candles are static, meaning they are fast, but cannot change
function addStaticCandles(scene: THREE.Scene, ohlcData: OHLC[], settings: ChartSettings) {
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
  ohlcData.reverse().forEach((ohlc, index) => {

    // Calculate candle body and height
    const body_height = Math.max(Math.abs(priceToNDC(ohlc[1], settings.minPrice, settings.maxPrice, settings.coordinateDelta)-priceToNDC(ohlc[4], settings.minPrice, settings.maxPrice, settings.coordinateDelta)), settings.minHeight);
    const wick_height = Math.abs(priceToNDC(ohlc[2], settings.minPrice, settings.maxPrice, settings.coordinateDelta)-priceToNDC(ohlc[3], settings.minPrice, settings.maxPrice, settings.coordinateDelta));
    const candle_type = ohlc[1] < ohlc[4];
    const candle_color = candle_type ? settings.upColor : settings.downColor;
  

    // Set candle color
    colorCache.set(candle_color);

    // Set body and wick color
    bodyMesh.setColorAt(index, colorCache);
    wickMesh.setColorAt(index, colorCache);


    // ---- Body ----
    // Set body height 
    _scale.set(settings.bodyWidth, body_height, 1);
    _body.scale.copy(_scale);

    // Set body location
    _body.position.setY(priceToNDC(candle_type ? ohlc[1] : ohlc[4], settings.minPrice, settings.maxPrice, settings.coordinateDelta)+body_height/2)
    _body.position.setX(-index*(settings.candleSpacing+settings.bodyWidth))
    _body.updateMatrix();

    // Update body mesh
    bodyMesh.setMatrixAt(index, _body.matrix)


    // ---- Wick ----
    // Set wick height 
    _scale.set(settings.wickWidth, wick_height, 1);
    _wick.scale.copy(_scale);

    // Set wick location
    _wick.position.setY(priceToNDC(ohlc[2], settings.minPrice, settings.maxPrice, settings.coordinateDelta)-wick_height/2)
    _wick.position.setX(-index*(settings.candleSpacing+settings.bodyWidth))
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
