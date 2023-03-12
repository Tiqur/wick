import Wick from './systems/wick';
import { addStaticCandles, addDynamicCandle, OHLC } from './components/candle';
import debugCandles from './assets/debugCandles.json';
import ChartSettings from './systems/chartSettings';

// Reference to container element
const container = document.getElementById("scene-container");

// Init Wick class
const wick = new Wick(container);
wick.showDebugMenu(true);

const chartSettings: ChartSettings = {
  upColor: '#d1d4dc',
  downColor: '#3179f5',
  minPrice: 10000,
  maxPrice: 10500,
  coordinateDelta: 1,
  candleSpacing: 0.2,
  bodyWidth: 0.4,
  wickWidth: 0.02
}

addDynamicCandle(wick.scene, debugCandles[0] as OHLC, chartSettings);
//addStaticCandles(wick.scene, debugCandles as OHLC[]);

wick.renderLoop.camera.position.z = 5;
wick.start();


