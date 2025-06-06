import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { UltraHDRLoader } from "three/examples/jsm/loaders/UltraHDRLoader.js";

import { transformCamera } from "./majors/camera";
import { onMove } from "./helpers/move";
import renderer from "./majors/renderer";
import {
  aboutMe,
  aboutMeCloseBtn,
  circles,
  contactsCloseBtn,
  contactsElem,
  controllers,
  enterBtn,
  landingPageContainer,
  myCanvas,
  pointer,
  projectsCloseBtn,
  projectsElem,
  skillsCloseBtn,
  skillsElem,
} from "./helpers/constant-values";
import scene from "./majors/scene";
import light from "./majors/light";
import animate from "./majors/animate";
import { glbLoader } from "./helpers/loaders/glb";

//
setTimeout(() => {
  circles.style.display = "none";
  enterBtn.style.display = "block";
}, 2000);

enterBtn.addEventListener("click", () => {
  landingPageContainer.style.display = "none";
});

// hdr loader
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
aboutMeCloseBtn.addEventListener(
  "click",
  () => (aboutMe.style.display = "none")
);
skillsCloseBtn.addEventListener(
  "click",
  () => (skillsElem.style.display = "none")
);
contactsCloseBtn.addEventListener(
  "click",
  () => (contactsElem.style.display = "none")
);
projectsCloseBtn.addEventListener(
  "click",
  () => (projectsElem.style.display = "none")
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
