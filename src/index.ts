import * as THREE from "three";


// Reference to container element
const container = document.getElementById("scene-container");

// Init renderer, camera, and scene
const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
const scene = new THREE.Scene();
scene.background = new THREE.Color('#171b26');

// Create Geometry and Material for scene
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);

// Add object to scene
scene.add(cube);

// Position camera
camera.position.z = 5;
cube.position.x = Math.random();

// Setup renderer
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio)
container.append(renderer.domElement);

// Render
renderer.render(scene, camera);
