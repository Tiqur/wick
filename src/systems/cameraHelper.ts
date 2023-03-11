import * as THREE from 'three';


export default class CameraHelper {
  scene: THREE.Scene;
  cameraHelper: THREE.CameraHelper;

  constructor(scene: THREE.Scene, camera: THREE.OrthographicCamera) {
    this.scene = scene;
    this.cameraHelper = new THREE.CameraHelper(camera);
  }

  enable() {
    this.scene.add(this.cameraHelper);
  }

  disable() {
    this.scene.remove(this.cameraHelper);
  }
}
