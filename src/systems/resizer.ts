import {PerspectiveCamera, WebGLRenderer} from "three";

export default class Resizer {
  container: HTMLElement;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;

  constructor(container: HTMLElement, camera: PerspectiveCamera, renderer: WebGLRenderer) {
    this.container = container; 
    this.camera = camera; 
    this.renderer = renderer; 
    this.resize()

    window.addEventListener('resize', () => {
      this.resize();
      this.onResize();
    })
  }

  resize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  onResize() {};
}
