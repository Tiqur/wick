import * as THREE from "three";
import Wick from './systems/wick';
import { addStaticCandles, addDynamicCandle, OHLC } from './components/candle';
import debugCandles from './assets/debugCandles.json';

// Reference to container element
const container = document.getElementById("scene-container");
const wick = new Wick(container);

//addDynamicCandle(wick.scene);
addStaticCandles(wick.scene, debugCandles as OHLC[]);

wick.camera.position.z = 5;
wick.render();


