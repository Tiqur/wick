import * as THREE from 'three';
import Resizer from './resizer';
import Loop from './loop';
import Stats from 'stats.js';
import {GUI} from 'dat.gui';

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
  stats: Stats;
  debugSettings: DebugSettings;
  debugGui: GUI;
  showDebugGui: boolean = false;

  constructor(container: HTMLElement) {
    this.container = container;
    this.init();
  }

  _initDebugSettings(): DebugSettings {

    // Init default settings
    const debugSettingsDefaults: DebugSettings = {
      FpsCounter: false,
      GridHelper: false,
    }

    // Enable / disable features based on default value
    this._showFpsCounter(debugSettingsDefaults.FpsCounter);

    return debugSettingsDefaults;
  }

  init() {
    // Set width and height to client width and client height
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    // Init stats gui 
    this.stats = new Stats();
    this.stats.showPanel(-1);

    // Set defaults and enable / disable features
    this.debugSettings = this._initDebugSettings();

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

    // Init Render loop
    this.renderLoop = new Loop(this.camera, this.scene, this.renderer, this.stats);

    // Append to DOM
    this.container.append(this.renderer.domElement);

    // Show Stats   
    this.container.append(this.stats.dom);

    // Init Debug GUI
    this.debugGui = new GUI();
    this._initDebugGUI();
  }

  _showFpsCounter(value: boolean) {
      this.stats.showPanel(value ? 0 : -1);
  }

  _initDebugGUI() {
    const debugFolder = this.debugGui.addFolder('Debug')
    debugFolder.add(this.debugSettings, 'FpsCounter', this.debugSettings.FpsCounter)
      .onChange(() => {
        this._showFpsCounter(this.debugSettings.FpsCounter);
      })
    debugFolder.add(this.debugSettings, 'GridHelper', this.debugSettings.GridHelper);
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
