import * as THREE from 'three';


export default class CombinedCamera {
  orthographicCamera: THREE.OrthographicCamera;
  perspectiveCamera: THREE.PerspectiveCamera;

  constructor() {
    this.orthographicCamera = new THREE.OrthographicCamera();
    this.perspectiveCamera = new THREE.PerspectiveCamera();
  }

  getOrthographicCamera() {
    return this.orthographicCamera;
  }

  getPerspectiveCamera() {
    return this.perspectiveCamera;
  }
}
