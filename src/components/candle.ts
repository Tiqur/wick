import * as THREE from 'three';


function setCandleMatrix(matrix: THREE.Matrix4, position = new THREE.Vector3(0, 0, 0), quaternion = new THREE.Quaternion(), scale = new THREE.Vector3(1, 1, 1)) {
  matrix.compose(position, quaternion, scale)
}

function addDynamicCandle(scene: THREE.Scene) {
  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}

function addStaticCandles(scene: THREE.Scene) {
  const count = 100;

  // Use as cache as to not create a new object every candle
  const mutableCandleMatrix = new THREE.Matrix4();

  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const mesh = new THREE.InstancedMesh(geometry, material, count) ;

  for (let i = 0; i < count; i++) {
    setCandleMatrix(mutableCandleMatrix, new THREE.Vector3(0, 0, 0));
    mesh.setMatrixAt(i, mutableCandleMatrix);
  }

  scene.add(mesh);
}

export { addStaticCandles, addDynamicCandle };
