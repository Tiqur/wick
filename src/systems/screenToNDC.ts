import * as THREE from 'three';

export default function screenToWorldCoords(mousePos: THREE.Vector2, cameraRef: THREE.OrthographicCamera,  screenWidth: number, screenHeight: number): THREE.Vector3 {
  const raycaster = new THREE.Raycaster();
  const x = (mousePos.x / screenWidth) * 2 - 1;
  const y = -(mousePos.y / screenHeight) * 2 + 1;

  const mouse = new THREE.Vector2(x, y);
  raycaster.setFromCamera(mouse, cameraRef);

  const intersectionPoint = new THREE.Vector3();
  raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 2), 0), intersectionPoint);
  console.log(intersectionPoint)

  return intersectionPoint;
}
