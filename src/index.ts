import * as THREE from "three";
import Wick from './systems/wick';
import { addStaticCandles, addDynamicCandle, OHLC } from './components/candle';
import debugCandles from './assets/debugCandles.json';
import { GUI } from 'dat.gui'
import Stats from 'stats.js';
import { OrbitControls } from './vendor/OrbitControls';

// Reference to container element
const container = document.getElementById("scene-container");

// Init Wick class
const wick = new Wick(container);

// Orbit Controls
const controls = new OrbitControls(wick.camera, wick.renderer.domElement);

// Fps counter
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

function animate() {
	stats.begin();
	// monitored code goes here
	stats.end();
	requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

const camera = { x: 0, y: 0, z: 0 };
const gui = new GUI()
const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera, 'x', -10, 10);
cameraFolder.add(camera, 'y', -10, 10);
cameraFolder.add(camera, 'z', -10, 10);
cameraFolder.open()

//addDynamicCandle(wick.scene, debugCandles[0] as OHLC);
addStaticCandles(wick.scene, debugCandles as OHLC[]);

wick.camera.position.z = 5;
wick.render();


