import Wick from './systems/wick';
import debugCandles from './assets/debugCandles.json';
import {OHLC} from './systems/ohlc';

// Reference to container element
const container = document.getElementById("scene-container");

// Init Wick class
const wick = new Wick(container);
wick.showDebugMenu(true);

// Render candles
wick.setCandles(debugCandles as OHLC[]);
wick.start();


