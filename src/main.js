import * as THREE from "three";
import { OrbitControls, UltraHDRLoader } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

// scene, camera, renderer
const scene = new THREE.Scene();
const aboutMe = document.querySelector(".about-me");
const aboutMeCloseBtn = document.querySelector(".about-me--close-btn");
const myCanvas = document.getElementById("my-canvas");

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let BP89 = {
  instance: null,
  moveDistance: 3,
};

const clickableObjects = [];
let intersectObject = "";
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

// const camera = new THREE.PerspectiveCamera(
//   60,
//   sizes.width / sizes.height,
//   0.1,
//   1000
// );

const aspectRatio = sizes.width / sizes.height;
const viewSize = 45;

const camera = new THREE.OrthographicCamera(
  (-aspectRatio * viewSize) / 2,
  (aspectRatio * viewSize) / 2,
  viewSize / 2,
  -viewSize / 2
);
camera.position.set(40, 40, 40);

const renderer = new THREE.WebGLRenderer({ canvas: myCanvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.3;

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

hdrLoader.castShadow = true;

// light
const light = new THREE.DirectionalLight(0xffffff, 5);
light.position.set(50, 100, 20);

light.target.position.set(0, 0, 0);
light.castShadow = true;
light.shadow.bias = -0.001;

light.shadow.camera.left = -80;
light.shadow.camera.right = 80;
light.shadow.camera.top = 60;
light.shadow.camera.bottom = -60;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
scene.add(light);
scene.add(light.target);

// glb loader
const loader = new GLTFLoader();
loader.load("/models/hassenPortfolio.glb", (glb) => {
  const models = glb.scene;
  scene.add(models);

  models.traverse((model) => {
    if (intersectObjectNames.includes(model.name)) {
      clickableObjects.push(model);
    }

    if (model.isMesh) {
      model.receiveShadow = true;
      model.castShadow = true;

      if (model.name === "BP-89") {
        const target = new THREE.Vector3();
        model.getWorldPosition(target);
        camera.position.set(target.x + 20, target.y + 30, target.z + 40);
        camera.lookAt(target);
      }
    }

    if (model.name == "BP-89") {
      BP89.instance = model;
    }
  });
});

function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onMove(event) {
  console.log(event.key);
  switch (event.key.toLowerCase()) {
    case "arrowup":
    case "w":
      BP89.instance.position.z -= BP89.moveDistance;
      break;

    case "arrowdown":
    case "s":
      BP89.instance.position.z += BP89.moveDistance;
      break;

    case "arrowleft":
    case "a":
      BP89.instance.position.x -= BP89.moveDistance;
      break;

    case "arrowright":
    case "d":
      BP89.instance.position.x += BP89.moveDistance;
      break;

    default:
      break;
  }
}

window.addEventListener("resize", onResize);
window.addEventListener("pointermove", onPointerMove);
window.addEventListener("click", () => {
  if (intersectObject === "pointer-about-me") {
    aboutMe.classList.toggle("about-me-hidden");
  }
});
aboutMeCloseBtn.addEventListener("click", () => {
  aboutMe.classList.add("about-me-hidden");
});
window.addEventListener("keydown", onMove);

function onResize() {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  const aspectROnRsize = window.innerWidth / window.innerHeight;

  camera.left = (-aspectROnRsize * viewSize) / 2;
  camera.right = (aspectROnRsize * viewSize) / 2;
  camera.top = viewSize / 2;
  camera.bottom = -viewSize / 2;

  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// animate
function animate() {
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(clickableObjects, true);

  if (intersects.length > 0) {
    document.body.style.cursor = "pointer";
    intersectObject = intersects[0].object.parent.name;
  } else {
    document.body.style.cursor = "default";
    intersectObject = "";
  }

  // for (let i = 0; i < intersects.length; i++) {}

  controls.update();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
