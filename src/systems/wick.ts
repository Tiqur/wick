import * as THREE from 'three';
import Resizer from './resizer';
import Loop from './loop';
import {GUI} from 'dat.gui';
import FpsCounter from './fpsCounter';
import GridHelper from './gridHelper';
import CameraHelper from './cameraHelper';
import { OrbitControls } from '../vendor/OrbitControls';
import DebugSettings from './debugSettings';
import ChartSettings from './chartSettings';
import priceToNDC from './priceToNDC';
import {OHLC} from '../systems/ohlc';

export default class Wick {
  container: HTMLElement;
  width: number;
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  height: number;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  renderLoop: Loop;
  debugSettings: DebugSettings;
  chartSettings: ChartSettings;
  debugGui: GUI;
  showDebugGui: boolean = false;
  fpsCounter: FpsCounter;
  gridHelper: GridHelper;
  cameraHelper: CameraHelper;
  oc: THREE.OrthographicCamera;
  pc: THREE.PerspectiveCamera;
  dynamicCandle: THREE.Group;
  staticCandles: THREE.Group;

  constructor(container: HTMLElement, chartSettings?: ChartSettings) {
    this.container = container;

    // Set width and height to client width and client height
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    // Set default debug settings
    this._initDebugSettings();

    // Init chart settings
    this._initChartSettings(chartSettings);



    this.init();
  }

  // Init chart settings
  _initChartSettings(chartSettings?: ChartSettings) {
    const DEFAULT_CHART_SETTINGS: ChartSettings = {
      upColor: '#d1d4dc',
      downColor: '#3179f5',
      minPrice: 5000,
      maxPrice: 10000,
      coordinateDelta: 1,
      candleSpacing: 0.15,
      bodyWidth: 0.4,
      wickWidth: 0.02,
      minHeight: 0.02
    }

    this.chartSettings = Object.assign({}, DEFAULT_CHART_SETTINGS, chartSettings);
  }

  // Init default settings
  _initDebugSettings() {
    this.debugSettings = {
      FpsCounter: true,
      GridHelper: false,
      OrbitControls: false,
      CameraHelper: false,
      CameraType: 'OrthographicCamera'
    }
  }

  init() {
    // Init renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    // Init scene
    this.scene = new THREE.Scene();

    // Init cameras
    this.oc = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
    this.pc = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    const ocControls = new OrbitControls(this.oc, this.renderer.domElement);
    const pcControls = new OrbitControls(this.pc, this.renderer.domElement);
    ocControls.enableRotate = false;
    ocControls.mouseButtons = { LEFT: THREE.MOUSE.PAN, MIDDLE: null, RIGHT: null  };
    
    // Add wheel events
    ocControls.addEventListener('wheel', e => {
      const scrollAmount = e.deltaY < 0 ? 1 : -1;
      this.chartSettings.coordinateDelta += scrollAmount;
    });

    this.camera = this.oc;

    // Init camera helper
    this.cameraHelper = new CameraHelper(this.scene, this.oc);

    // Init resizer
    //const resizer = new Resizer(this.container, this.camera, this.renderer);
    //resizer.onResize = () => {
    //  this.render();
    //}

    // Set defaults
    this.setBackgroundColor('#171b26')

    // Setup renderer
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio)

    // Init FPS counter
    this.fpsCounter = new FpsCounter(this.container);

    // Init Grid Helper
    this.gridHelper = new GridHelper(this.scene);

    // Init Render loop
    this.renderLoop = new Loop(this.camera, this.scene, this.renderer, this.fpsCounter.stats, this.cameraHelper.cameraHelper);

    // Append to DOM
    this.container.append(this.renderer.domElement);

    // Init Debug GUI
    this.debugGui = new GUI();
    this._initDebugGUI();
    this.showDebugMenu(this.showDebugGui);

    // Change cursor to crosshair if over canvas
    this._initCursorChangeEventListeners();
  }

  _initCursorChangeEventListeners() {
    this.container.addEventListener('mousemove', () => {
      this.renderer.domElement.style.cursor = 'crosshair';
    })
    this.container.addEventListener('mouseenter', () => {
      this.renderer.domElement.style.cursor = 'crosshair';
    })
    this.container.addEventListener('mouseleave', () => {
      this.renderer.domElement.style.cursor = 'initial';
    })
  }

  // Hide ( don't disable )
  _hideDebugFeatures() {
    this.fpsCounter.disable();
    this.gridHelper.disable();
  }

  // Set features according to states
  _updateDebugFeaturesStates() {
    this.fpsCounter[this.debugSettings.FpsCounter ? 'enable' : 'disable']();
    this.gridHelper[this.debugSettings.GridHelper ? 'enable' : 'disable']();
    this.cameraHelper[this.debugSettings.CameraHelper ? 'enable' : 'disable']();

    // Swap camera types
    if (this.debugSettings.CameraType != this.camera.type) {
      this.camera = this.camera == this.oc ? this.pc : this.oc;

      // Set renderloop camera
      this.renderLoop.setCamera(this.camera);

      // Position perspective camera to look at orthographic camera position
      if (this.camera == this.pc) {
        const pos = this.camera.position.copy(this.oc.position);
        pos.x += 10;
        pos.y += 10;
        pos.z += 10;
        this.camera.lookAt(this.oc.position.x, this.oc.position.y, this.oc.position.z);
      }
    }
  }

  _initDebugGUI() {
    const debugFolder = this.debugGui.addFolder('Debug')
    debugFolder.add(this.debugSettings, 'FpsCounter', this.debugSettings.FpsCounter)
      .onChange(() => {
        this._updateDebugFeaturesStates();
      })
    debugFolder.add(this.debugSettings, 'GridHelper', this.debugSettings.GridHelper)
      .onChange(() => {
        this._updateDebugFeaturesStates();
      })
    debugFolder.add(this.debugSettings, 'CameraHelper', this.debugSettings.CameraHelper)
      .onChange(() => {
        this._updateDebugFeaturesStates();
      })
    debugFolder.add(this.debugSettings, 'CameraType', ["OrthographicCamera", "PerspectiveCamera"])
      .onChange(() => {
        this._updateDebugFeaturesStates();
      })

    debugFolder.open()
  }

  setBackgroundColor(color: string) {
    this.scene.background = new THREE.Color(color);
  }

  start() {
    this.renderLoop.start();
  }

  stop() {
    this.renderLoop.stop();
  }

  showDebugMenu(value: boolean) {
    this.showDebugGui = value; 

    if (value) {
      this.debugGui.show();
      this._updateDebugFeaturesStates();
    } else {
      this.debugGui.hide();
      this._hideDebugFeatures();
    }
  }
  
  setCandles(ohlcData: OHLC[]) {
    const lookback = 10;
    const lastXElements = ohlcData.slice(-lookback);
    this.chartSettings.minPrice = Math.min(...lastXElements.map(e => e[3]));
    this.chartSettings.maxPrice = Math.max(...lastXElements.map(e => e[2]));
    this._setDynamicCandle(ohlcData[ohlcData.length-1]);
    this._setStaticCandles(ohlcData.slice(0, ohlcData.length-1));
  }

  // These candles are static, meaning they are fast, but cannot change
  _setStaticCandles(ohlcData: OHLC[]) {
    this.scene.remove(this.staticCandles);

    // Candle count
    const count = ohlcData.length;

    // Cached values to be changed
    const _body = new THREE.Object3D();
    const _wick = new THREE.Object3D();
    const _scale = new THREE.Vector3();

    // Geometry
    const body_geometry = new THREE.PlaneGeometry();
    const body_material = new THREE.MeshBasicMaterial();
    const wick_geometry = new THREE.PlaneGeometry();
    const wick_material = new THREE.MeshBasicMaterial();

    // Mesh
    const bodyMesh = new THREE.InstancedMesh(body_geometry, body_material, count);
    const wickMesh = new THREE.InstancedMesh(wick_geometry, wick_material, count);

    // Init group
    const group = new THREE.Group();

    const colorCache = new THREE.Color();
    ohlcData.reverse().forEach((ohlc, index) => {

      // Calculate candle body and height
      const body_height = Math.max(Math.abs(priceToNDC(ohlc[1], this.chartSettings.minPrice, this.chartSettings.maxPrice, this.chartSettings.coordinateDelta)-priceToNDC(ohlc[4], this.chartSettings.minPrice, this.chartSettings.maxPrice, this.chartSettings.coordinateDelta)), this.chartSettings.minHeight);
      const wick_height = Math.abs(priceToNDC(ohlc[2], this.chartSettings.minPrice, this.chartSettings.maxPrice, this.chartSettings.coordinateDelta)-priceToNDC(ohlc[3], this.chartSettings.minPrice, this.chartSettings.maxPrice, this.chartSettings.coordinateDelta));
      const candle_type = ohlc[1] < ohlc[4];
      const candle_color = candle_type ? this.chartSettings.upColor : this.chartSettings.downColor;
    

      // Set candle color
      colorCache.set(candle_color);

      // Set body and wick color
      bodyMesh.setColorAt(index, colorCache);
      wickMesh.setColorAt(index, colorCache);


      // ---- Body ----
      // Set body height 
      _scale.set(this.chartSettings.bodyWidth, body_height, 1);
      _body.scale.copy(_scale);

      // Set body location
      _body.position.setY(priceToNDC(candle_type ? ohlc[1] : ohlc[4], this.chartSettings.minPrice, this.chartSettings.maxPrice, this.chartSettings.coordinateDelta)+body_height/2)
      _body.position.setX((-index-1)*(this.chartSettings.candleSpacing+this.chartSettings.bodyWidth))
      _body.updateMatrix();

      // Update body mesh
      bodyMesh.setMatrixAt(index, _body.matrix)


      // ---- Wick ----
      // Set wick height 
      _scale.set(this.chartSettings.wickWidth, wick_height, 1);
      _wick.scale.copy(_scale);

      // Set wick location
      _wick.position.setY(priceToNDC(ohlc[2], this.chartSettings.minPrice, this.chartSettings.maxPrice, this.chartSettings.coordinateDelta)-wick_height/2)
      _wick.position.setX((-index-1)*(this.chartSettings.candleSpacing+this.chartSettings.bodyWidth))
      _wick.updateMatrix();

      // Update wick mesh
      wickMesh.setMatrixAt(index, _wick.matrix)
    });

    // Add all candles to scene
    group.add(wickMesh);
    group.add(bodyMesh);
    this.scene.add(group);

    this.staticCandles = group;
  }

  // The niave method is good for very dynamic objects, but try not to use it too much
  _setDynamicCandle(ohlc: OHLC) {
    this.scene.remove(this.dynamicCandle);

    // Contains entire candle
    const group = new THREE.Group();

    const index = 0;

    // Calculate candle body and height
    const body_height = Math.max(Math.abs(priceToNDC(ohlc[1], this.chartSettings.minPrice, this.chartSettings.maxPrice, this.chartSettings.coordinateDelta)-priceToNDC(ohlc[4], this.chartSettings.minPrice, this.chartSettings.maxPrice, this.chartSettings.coordinateDelta)), this.chartSettings.minHeight);
    const wick_height = Math.abs(priceToNDC(ohlc[2], this.chartSettings.minPrice, this.chartSettings.maxPrice, this.chartSettings.coordinateDelta)-priceToNDC(ohlc[3], this.chartSettings.minPrice, this.chartSettings.maxPrice, this.chartSettings.coordinateDelta));
    const candle_type = ohlc[1] < ohlc[4];
    const candle_color = candle_type ? this.chartSettings.upColor : this.chartSettings.downColor;
    
    // Candle body
    const body_geometry = new THREE.PlaneGeometry(this.chartSettings.bodyWidth, body_height);
    const body_material = new THREE.MeshBasicMaterial({ color: 'red' });
    const body_mesh = new THREE.Mesh(body_geometry, body_material);
    body_mesh.position.setY(priceToNDC(candle_type ? ohlc[1] : ohlc[4], this.chartSettings.minPrice, this.chartSettings.maxPrice, this.chartSettings.coordinateDelta)+body_height/2)
    body_mesh.position.setX(-index*(this.chartSettings.candleSpacing+this.chartSettings.bodyWidth))
    group.add(body_mesh);

    // Candle wick
    const wick_geometry = new THREE.PlaneGeometry(this.chartSettings.wickWidth, wick_height);
    const wick_material = new THREE.MeshBasicMaterial({ color: 'red' });
    const wick_mesh = new THREE.Mesh(wick_geometry, wick_material);
    wick_mesh.position.setY(priceToNDC(ohlc[2], this.chartSettings.minPrice, this.chartSettings.maxPrice, this.chartSettings.coordinateDelta)-wick_height/2)
    wick_mesh.position.setX(-index*(this.chartSettings.candleSpacing+this.chartSettings.bodyWidth))
    group.add(wick_mesh);

    // Add to scene
    this.scene.add(group);

    this.dynamicCandle = group;
  }
}
