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
  maxPrice: 10100,
  coordinateDelta: 8,
  candleSpacing: 0.2,
  bodyWidth: 0.4,
  wickWidth: 0.02,
  minHeight: 0.02
}

// Render candles
addStaticCandles(wick.scene, debugCandles as OHLC[], chartSettings);
//addDynamicCandle(wick.scene, debugCandles[0] as OHLC, chartSettings);

wick.renderLoop.camera.position.z = 5;
wick.start();


