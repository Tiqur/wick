import * as THREE from 'three';


export default class GridHelper {
  gridHelper: THREE.GridHelper;
  scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.gridHelper = new THREE.GridHelper(100);
    this.scene = scene;
  }

  enable() {
    this.scene.add(this.gridHelper);
  }

  disable() {
    this.scene.remove(this.gridHelper);
  }
}
