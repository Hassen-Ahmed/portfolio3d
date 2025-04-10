import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

// scene, camera, renderer
const scene = new THREE.Scene();

const fov = 60;
let winWidth = window.innerWidth;
let winHeight = window.innerHeight;

const aspectR = winWidth / winHeight;

const camera = new THREE.PerspectiveCamera(fov, aspectR, 0.1, 1000);
camera.position.set(0, 5, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(winWidth, winHeight);
document.body.appendChild(renderer.domElement);

// orbitControls
const controls = new OrbitControls(camera, renderer.domElement);
// controls.target.set(0, 0, 0);

// cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, mat);
scene.add(cube);

// animate
function animate() {
  controls.update();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
