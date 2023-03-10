import * as THREE from 'three';
import Resizer from './resizer';
import Loop from './loop';
import {GUI} from 'dat.gui';
import FpsCounter from './fpsCounter';
import GridHelper from './gridHelper';

interface DebugSettings {
  FpsCounter: boolean
  GridHelper: boolean
}

export default class Wick {
  container: HTMLElement;
  width: number;
  height: number;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  renderLoop: Loop;
  debugSettings: DebugSettings;
  debugGui: GUI;
  showDebugGui: boolean = false;
  fpsCounter: FpsCounter;
  gridHelper: GridHelper;

  constructor(container: HTMLElement) {
    this.container = container;
    this.init();
  }

  _initDebugSettings() {
    // Init default settings
    this.debugSettings = {
      FpsCounter: true,
      GridHelper: false,
    }
  }

  init() {
    // Set width and height to client width and client height
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    // Set defaults and enable / disable features
    this._initDebugSettings();

    // Init renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    // Init camera
    this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 1000);

    // Init scene
    this.scene = new THREE.Scene();

    // Init resizer
    const resizer = new Resizer(this.container, this.camera, this.renderer);
    resizer.onResize = () => {
      this.render();
    }

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
    this.renderLoop = new Loop(this.camera, this.scene, this.renderer, this.fpsCounter.stats);

    // Append to DOM
    this.container.append(this.renderer.domElement);

    // Init Debug GUI
    this.debugGui = new GUI();
    this._initDebugGUI();
    this._updateDebugFeaturesStates();
  }

  // Set defaults
  _updateDebugFeaturesStates() {
    this.fpsCounter[this.debugSettings.FpsCounter ? 'enable' : 'disable']();
    this.gridHelper[this.debugSettings.GridHelper ? 'enable' : 'disable']();
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

    debugFolder.open()
  }

  setBackgroundColor(color: string) {
    this.scene.background = new THREE.Color(color);
  }

  render() {
    // Render scene
    this.renderer.render(this.scene, this.camera);
  }

  start() {
    this.renderLoop.start();
  }

  stop() {
    this.renderLoop.stop();
  }

  showDebugMenu(value: boolean) {
    this.showDebugGui = value; 
  }
}
