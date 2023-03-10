import * as THREE from 'three';
import Resizer from './resizer';

export default class Wick {
  container: HTMLElement;
  width: number;
  height: number;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;

  constructor(container: HTMLElement) {
    this.container = container;
    this.init();
  }

  init() {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    
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

    // Append to DOM
    this.container.append(this.renderer.domElement);
  }

  setBackgroundColor(color: string) {
    this.scene.background = new THREE.Color(color);
  }

  render() {
    // Render scene
    this.renderer.render(this.scene, this.camera);
  }
}
