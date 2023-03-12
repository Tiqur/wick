import * as THREE from 'three';


export default class GridHelper {
  private gridHelper: THREE.GridHelper;
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.gridHelper = new THREE.GridHelper(10, 10);
    this.gridHelper.position.setY(-1);
    this.scene = scene;
  }

  enable() {
    this.scene.add(this.gridHelper);
  }

  disable() {
    this.scene.remove(this.gridHelper);
  }
}
