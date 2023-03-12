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
      console.log('wheel');
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
}
