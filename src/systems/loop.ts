import { Clock, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

export default class Loop {
  camera: PerspectiveCamera;
  scene: Scene;
  renderer: WebGLRenderer;
  stats: Stats;
  constructor(camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer, stats: Stats) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.stats = stats;
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      // Update FPS counter
      this.stats.update()

      // Render scene
      this.renderer.render(this.scene, this.camera);
    })
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }
}
