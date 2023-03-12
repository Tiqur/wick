import Wick from './systems/wick';
import { addStaticCandles, addDynamicCandle, OHLC } from './components/candle';
import debugCandles from './assets/debugCandles.json';
import ChartSettings from './systems/chartSettings';

// Reference to container element
const container = document.getElementById("scene-container");

// Init Wick class
const wick = new Wick(container, { upColor: 'green' });
wick.showDebugMenu(true);

// Render candles
addStaticCandles(wick.scene, debugCandles as OHLC[], wick.chartSettings);
//addDynamicCandle(wick.scene, debugCandles[0] as OHLC, chartSettings);

wick.renderLoop.camera.position.z = 5;
wick.start();


