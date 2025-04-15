import "./styling/main.scss";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { UltraHDRLoader } from "three/examples/jsm/loaders/UltraHDRLoader.js";

import { gsap } from "gsap/gsap-core";
import { modalToggler } from "./helpers/toggler";
import { transformCamera } from "./helpers/camera";
import { onBP89OnMove, onCollusion } from "./helpers/move";
import { rendererSetter } from "./helpers/rendererSetter";
import { lightSetup } from "./helpers/lightSetup";

// scene, camera, renderer
const scene = new THREE.Scene();
const aboutMe = document.querySelector(".about-me");
const aboutMeCloseBtn = document.querySelector(".about-me--close-btn");
const myCanvas = document.getElementById("my-canvas");

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(1, 1);
let movementDirection = null;
let BP89 = {
  instance: null,
  moveDistance: 4,
  moveDuration: 0.5,
  isMoving: false,
  jumpHeight: 2,
  jumpSpeed: 5,
};

const objectsToRotateInLoop = [];
const clickableObjects = [];
const intersectObjectNames = [
  "pointer-about-me",
  "pointer-contact",
  "pointer-projects",
  "pointer-skills",
];

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const aspectRatio = sizes.width / sizes.height;

const viewSize = { value: window.innerWidth < 500 ? 65 : 45 };

const camera = new THREE.OrthographicCamera(
  (-aspectRatio * viewSize.value) / 2,
  (aspectRatio * viewSize.value) / 2,
  viewSize.value / 2,
  -viewSize.value / 2
);

camera.zoom = 1.2;
camera.updateProjectionMatrix();
const cameraOffset = new THREE.Vector3(40, 40, 40);

const renderer = new THREE.WebGLRenderer({ canvas: myCanvas, antialias: true });
rendererSetter(THREE, renderer, sizes);

// orbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.minZoom = 0.22; // we don't need maxZoom
controls.enableRotate = false;
controls.enableZoom = true;
controls.enablePan = true;

// hdr
const hdrLoader = new UltraHDRLoader();
hdrLoader.load("/images/san_giuseppe_bridge_2k.jpg", (hdr) => {
  hdr.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = hdr;
  scene.environment = hdr;
  scene.environmentIntensity = 0.2;
});

// light
const light = new THREE.DirectionalLight(0xffffff, 5);
lightSetup(scene, light);

const wallsClickable = [];
const wallsBoundary = [];
const cubeBB = new THREE.Box3();
const wallBBBoundary = Array(12).fill(new THREE.Box3());
const wallBBsClickables = Array(4).fill(new THREE.Box3());

// glb loader
const loader = new GLTFLoader();
loader.load("/models/hassenPortfolio.glb", (glb) => {
  const models = glb.scene;
  scene.add(models);

  models.traverse((model) => {
    if (model.name.includes("wall-boundary")) {
      model.visible = false;
      wallsBoundary.push(model);
    }

    if (intersectObjectNames.includes(model.name)) {
      model.scale.set(0, 0, 0);
      clickableObjects.push(model);

      const geometryWall = new THREE.BoxGeometry(2, 2, 2);
      const material = new THREE.MeshBasicMaterial({
        opacity: 0,
        visible: false,
      });
      const wall = new THREE.Mesh(geometryWall, material);
      wall.name = model.name;
      wall.position.x = model.position.x;
      wall.position.y = 1;
      wall.position.z = model.position.z;
      scene.add(wall);
      wallsClickable.push(wall);
    }

    if (model.name.includes("wind-turbine-wing")) {
      objectsToRotateInLoop.push(model);
    }

    if (model.name == "BP-89") {
      BP89.instance = model;
    }

    if (model.isMesh) {
      model.receiveShadow = true;
      model.castShadow = true;
    }
  });
});

function moveBP89(targetPosition, targetRotationY) {
  BP89.isMoving = true;
  viewSize.value = 45;

  const tl = gsap.timeline({
    defaults: {
      duration: BP89.moveDuration,
      ease: "power1.inOut",
    },
    onComplete: () => (BP89.isMoving = false),
  });

  tl.to(BP89.instance.position, {
    x: targetPosition.x,
    z: targetPosition.z,
  });

  tl.to(
    BP89.instance.position,
    { y: BP89.instance.position.y + BP89.jumpHeight, yoyo: true, repeat: 1 },
    0
  );
  tl.to(BP89.instance.rotation, { y: targetRotationY }, 0);
  tl.timeScale(BP89.jumpSpeed);
}

function onCanvasClick(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  setTimeout(() => pointer.set(1, 1), 20);
}

myCanvas.addEventListener("click", onCanvasClick);
aboutMeCloseBtn.addEventListener("click", () => {
  aboutMe.classList.add("about-me-hidden");
});

const controllers = document.getElementsByClassName("controller");
[...controllers].forEach((controller) => {
  controller.addEventListener("click", onMove);
});

function onMove(event) {
  movementDirection =
    event?.key?.toLowerCase() ?? event?.target?.dataset.action;

  onBP89OnMove(event, THREE, BP89, camera, moveBP89);
}

window.addEventListener("keydown", onMove);
window.addEventListener("resize", onResize);

function onResize() {
  transformCamera(camera, sizes, viewSize, renderer);
}

// animate
function animate() {
  if (BP89.instance) {
    const targetCameraPosition = new THREE.Vector3(
      BP89.instance.position.x + cameraOffset.x,
      cameraOffset.y,
      BP89.instance.position.z + cameraOffset.z
    );
    camera.position.copy(targetCameraPosition);
    camera.lookAt(BP89.instance.position);
    const staticLookAt = new THREE.Vector3(
      BP89.instance.position.x - 10,
      0,
      BP89.instance.position.z - 10
    );
    controls.target.copy(staticLookAt);
  }

  // rotate in loop turbine wind
  objectsToRotateInLoop.forEach((turbine) => {
    turbine.rotation.z += 0.1;
  });

  // raycaster
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(clickableObjects, true);

  modalToggler(intersects, clickableObjects, [aboutMe]);

  if (BP89.instance) {
    onCollusion(
      BP89,
      cubeBB,
      movementDirection,
      wallsBoundary,
      wallBBBoundary,
      wallsClickable,
      wallBBsClickables,
      clickableObjects
    );
  }
  let zDistance = BP89?.instance?.position.z;
  let xDistance = BP89?.instance?.position.x;

  if (zDistance > 68 || zDistance < -68 || xDistance > 55 || xDistance < -55) {
    BP89.instance.position.set(23.6104736328125, 0, 12.246556282043457);
  }

  controls.update();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
