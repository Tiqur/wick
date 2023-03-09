import * as THREE from "three";
import Wick from './systems/wick';



// Reference to container element
const container = document.getElementById("scene-container");
const wick = new Wick(container);

// Create Geometry and Material for scene
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);

// Add object to scene
wick.scene.add(cube);

// Position camera
wick.camera.position.z = 5;
cube.position.x = Math.random();

wick.render();


