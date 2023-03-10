import * as THREE from 'three';


export default class CombinedCamera {
  orthographicCamera: THREE.OrthographicCamera;
  perspectiveCamera: THREE.PerspectiveCamera;
  scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.orthographicCamera = new THREE.OrthographicCamera();
    this.perspectiveCamera = new THREE.PerspectiveCamera();
  }

  enableOrthographicCamera() {
    this.scene.remove(this.perspectiveCamera);
    this.scene.add(this.orthographicCamera);
  }

  enablePerspectiveCamera() {
    this.scene.remove(this.orthographicCamera);
    this.scene.add(this.perspectiveCamera);
  }
}
