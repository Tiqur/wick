import * as THREE from 'three';


export default class CameraHelper {
  private scene: THREE.Scene;
  private cameraHelper: THREE.CameraHelper;

  constructor(scene: THREE.Scene, camera: THREE.OrthographicCamera) {
    this.scene = scene;
    this.cameraHelper = new THREE.CameraHelper(camera);
  }

  getCameraHelper() {
    return this.cameraHelper;
  }

  enable() {
    this.scene.add(this.cameraHelper);
  }

  disable() {
    this.scene.remove(this.cameraHelper);
  }
}
