import * as THREE from "three";
import Wick from './systems/wick';
import { addStaticCandles, addDynamicCandle, OHLC } from './components/candle';
import debugCandles from './assets/debugCandles.json';
import { GUI } from 'dat.gui'
import { OrbitControls } from './vendor/OrbitControls';

// Reference to container element
const container = document.getElementById("scene-container");

// Init Wick class
const wick = new Wick(container);

// Orbit Controls
new OrbitControls(wick.camera, wick.renderer.domElement);

const camera = { x: 0, y: 0, z: 0 };
const gui = new GUI()
const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera, 'x', -10, 10);
cameraFolder.add(camera, 'y', -10, 10);
cameraFolder.add(camera, 'z', -10, 10);
cameraFolder.open()

//addDynamicCandle(wick.scene, debugCandles[0] as OHLC);
addStaticCandles(wick.scene, debugCandles as OHLC[]);

wick.scene.add(new THREE.GridHelper(10, 10));

wick.camera.position.z = 5;
wick.start();


