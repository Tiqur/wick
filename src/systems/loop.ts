import { CameraHelper, OrthographicCamera, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

export default class Loop {
  private camera: OrthographicCamera | PerspectiveCamera;
  private scene: Scene;
  private renderer: WebGLRenderer;
  private stats: Stats;
  private cameraHelper: CameraHelper;

  constructor(camera: OrthographicCamera | PerspectiveCamera, scene: Scene, renderer: WebGLRenderer, stats: Stats, cameraHelper: CameraHelper) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.stats = stats;
    this.cameraHelper = cameraHelper;
  }

  setCamera(camera: OrthographicCamera | PerspectiveCamera) {
    this.camera = camera;
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      // Update FPS counter
      this.stats.update()

      // Update CameraHelper position
      this.cameraHelper.update()

      // Render scene
      this.renderer.render(this.scene, this.camera);
    })
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }
}
