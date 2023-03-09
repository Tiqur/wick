import * as THREE from "three";
import Wick from './systems/wick';
import { addStaticCandles, addDynamicCandle } from './components/candle';



// Reference to container element
const container = document.getElementById("scene-container");
const wick = new Wick(container);

addDynamicCandle(wick.scene);

wick.camera.position.z = 5;
wick.render();


