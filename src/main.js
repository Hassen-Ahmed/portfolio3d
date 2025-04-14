import "./styling/main.scss";
import * as THREE from "three";
import { OrbitControls, UltraHDRLoader } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { gsap } from "gsap/gsap-core";

// scene, camera, renderer
const scene = new THREE.Scene();
const aboutMe = document.querySelector(".about-me");
const aboutMeCloseBtn = document.querySelector(".about-me--close-btn");
const myCanvas = document.getElementById("my-canvas");

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let BP89 = {
  instance: null,
  moveDistance: 4,
  moveDuration: 0.5,
  isMoving: false,
  jumpHeight: 2,
  jumpSpead: 5,
};
const walls = [];
const objectsToRotateInLoop = [];
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

const cubeBB = new THREE.Box3();
const wallBBs = [
  new THREE.Box3(),
  new THREE.Box3(),
  new THREE.Box3(),
  new THREE.Box3(),
];

// glb loader
const loader = new GLTFLoader();
loader.load("/models/hassenPortfolio.glb", (glb) => {
  const models = glb.scene;
  scene.add(models);

  models.traverse((model) => {
    if (intersectObjectNames.includes(model.name)) {
      model.scale.set(0, 0, 0);
      clickableObjects.push(model);

      // walls
      const geometryWal = new THREE.BoxGeometry(2, 2, 2);
      const material = new THREE.MeshBasicMaterial({
        opacity: 0,
        visible: false,
      });

      const wall = new THREE.Mesh(geometryWal, material);
      wall.name = model.name;
      wall.position.x = model.position.x;
      wall.position.y = 1;
      wall.position.z = model.position.z;
      scene.add(wall);
      walls.push(wall);
    }

    if (model.name.includes("wind-turbine-wing")) {
      objectsToRotateInLoop.push(model);
    }

    if (model.isMesh) {
      model.receiveShadow = true;
      model.castShadow = true;
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
  tl.timeScale(BP89.jumpSpead);
}

function onMove(event) {
  if (event?.target?.id === "speed-up" && BP89.jumpSpead < 10)
    BP89.jumpSpead += 1;

  if (event?.target?.id === "speed-down" && BP89.jumpSpead > 2)
    BP89.jumpSpead -= 1;

  if (event?.target?.id === "zoom-in" && camera.zoom < 2.2) {
    camera.zoom += 0.1;
    camera.updateProjectionMatrix();
  }

  if (event?.target?.id === "zoom-out") {
    camera.zoom -= 0.1;
    camera.updateProjectionMatrix();
  }

  if (BP89.isMoving) return;

  const targetPosition = new THREE.Vector3().copy(BP89.instance.position);
  let targetRotationY = 0;

  switch (event?.key?.toLowerCase() || event?.target?.id) {
    case "arrowup":
    case "w":
    case "up-arrow":
      targetPosition.z -= BP89.moveDistance;
      targetRotationY = 0;
      break;

    case "arrowdown":
    case "s":
    case "down-arrow":
      targetPosition.z += BP89.moveDistance;
      targetRotationY = Math.PI;
      break;

    case "arrowleft":
    case "a":
    case "left-arrow":
      targetPosition.x -= BP89.moveDistance;
      targetRotationY = Math.PI / 2;
      break;

    case "arrowright":
    case "d":
    case "right-arrow":
      targetPosition.x += BP89.moveDistance;
      targetRotationY = -Math.PI / 2;
      break;

    default:
      break;
  }

  moveBP89(targetPosition, targetRotationY);
}

// listners
const controllers = document.getElementsByClassName("controller");

[...controllers].forEach((controller) => {
  controller.addEventListener("click", onMove);
});

window.addEventListener("resize", onResize);
window.addEventListener("pointermove", onPointerMove);
window.addEventListener("click", () => {
  if (intersectObject === "pointer-about-me") {
    aboutMe.classList.remove("about-me-hidden");
    BP89.instance.position.x = -3;
  }
  if (intersectObject === "pointer-contact") {
    console.log("pointer-contact");
  }
  if (intersectObject === "pointer-projects") {
    console.log("pointer-projects");
  }
  if (intersectObject === "pointer-skills") {
    console.log("pointer-skills");
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

  camera.left = (-aspectROnRsize * viewSize.value) / 2;
  camera.right = (aspectROnRsize * viewSize.value) / 2;
  camera.top = viewSize.value / 2;
  camera.bottom = -viewSize.value / 2;

  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
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

  if (intersects.length > 0) {
    document.body.style.cursor = "pointer";
    intersectObject = intersects[0].object.parent.name;
  } else {
    document.body.style.cursor = "default";
    clickableObjects.forEach((item) => {
      item.scale.set(0, 0, 0);
    });
    intersectObject = "";
  }

  // for (let i = 0; i < intersects.length; i++) {}

  // colusion detection
  if (BP89.instance) {
    cubeBB.setFromObject(BP89.instance);

    walls.forEach((wall, i) => {
      wallBBs[i].setFromObject(wall);
      wallBBs[i].expandByScalar(0.3);

      if (cubeBB.intersectsBox(wallBBs[i])) {
        clickableObjects.forEach((item) => {
          if (wall.name === item.name) {
            item.scale.set(2, 2, 2);
          }
        });
      }
    });
  }

  controls.update();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
