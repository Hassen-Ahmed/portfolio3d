import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { UltraHDRLoader } from "three/examples/jsm/loaders/UltraHDRLoader.js";

import { transformCamera } from "./majors/camera";
import { onMove } from "./helpers/move";
import renderer from "./majors/renderer";
import {
  aboutMe,
  controllers,
  myCanvas,
  pointer,
} from "./helpers/constant-values";
import scene from "./majors/scene";
import light from "./majors/light";
import animate from "./majors/animate";
import { glbLoader } from "./helpers/loaders/glb";

// hdr
const hdrLoader = new UltraHDRLoader();
hdrLoader.load("/images/san_giuseppe_bridge_2k.jpg", (hdr) => {
  hdr.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = hdr;
  scene.environment = hdr;
  scene.environmentIntensity = 0.2;
});

// glbLoader
const loader = new GLTFLoader();
loader.load("/models/hassenPortfolio.glb", (glb) => glbLoader(glb));

// eventListners
[...controllers].forEach((controller) => {
  controller.addEventListener("click", onMove);
});
window.addEventListener("keydown", onMove);
window.addEventListener("resize", transformCamera);
const aboutMeCloseBtn = document.querySelector(".about-me--close-btn");
aboutMeCloseBtn.addEventListener(
  "click",
  () => (aboutMe.style.display = "none")
);
myCanvas.addEventListener("click", onCanvasClick);

function onCanvasClick(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  setTimeout(() => pointer.set(1, 1), 20);
}

scene.add(light);
scene.add(light.target);

renderer.setAnimationLoop(animate);
