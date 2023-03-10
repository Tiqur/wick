import Wick from './systems/wick';
import { addStaticCandles, addDynamicCandle, OHLC } from './components/candle';
import debugCandles from './assets/debugCandles.json';
import { OrbitControls } from './vendor/OrbitControls';

// Reference to container element
const container = document.getElementById("scene-container");

// Init Wick class
const wick = new Wick(container);
wick.showDebugMenu(true);

// Orbit Controls
new OrbitControls(wick.camera, wick.renderer.domElement);

//addDynamicCandle(wick.scene, debugCandles[0] as OHLC);
addStaticCandles(wick.scene, debugCandles as OHLC[]);

wick.camera.position.z = 5;
wick.start();


