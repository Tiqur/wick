import * as THREE from "three";
import Wick from './systems/wick';
import { addStaticCandles, addDynamicCandle, OHLC } from './components/candle';
import debugCandles from './assets/debugCandles.json';
import { GUI } from 'dat.gui'

// Reference to container element
const container = document.getElementById("scene-container");
const wick = new Wick(container);

const camera = { x: 0, y: 0, z: 0 };
const gui = new GUI()
const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera, 'x', -10, 10);
cameraFolder.add(camera, 'y', -10, 10);
cameraFolder.add(camera, 'z', -10, 10);
cameraFolder.open()

//addDynamicCandle(wick.scene);
addStaticCandles(wick.scene, debugCandles as OHLC[]);

wick.camera.position.z = 5;
wick.render();


