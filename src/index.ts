import * as THREE from "three";


// Get canvas element
const canvas = document.getElementById("canvas");

// Init renderer, camera, and scene
const renderer = new THREE.WebGLRenderer({ canvas });
const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
const scene = new THREE.Scene();

// Create Geometry and Material for scene
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);

// Add object to scene
scene.add(cube);

// Position camera
camera.position.z = 5;
cube.position.x = -2;

// Render
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.render(scene, camera);
