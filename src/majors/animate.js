import * as THREE from "three";
import {
  BP89,
  clickableObjects,
  objectsToRotateInLoop,
  wallsBoundary,
  wallsClickable,
} from "../helpers/dynamic-values";
import {
  aboutMe,
  cameraOffset,
  contactsElem,
  pointer,
  projectsElem,
  skillsElem,
} from "../helpers/constant-values";
import camera from "./camera";
import renderer from "./renderer";
import { modalToggler } from "../helpers/toggler";
import scene from "./scene";
import { onCollusion } from "../helpers/move";
import controls from "./controls";

const raycaster = new THREE.Raycaster();

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

  modalToggler(intersects, clickableObjects, [
    aboutMe,
    skillsElem,
    contactsElem,
    projectsElem,
  ]);

  if (BP89.instance) {
    onCollusion(wallsBoundary, wallsClickable, clickableObjects);
  }
  let zDistance = BP89?.instance?.position.z;
  let xDistance = BP89?.instance?.position.x;

  if (zDistance > 68 || zDistance < -68 || xDistance > 55 || xDistance < -55) {
    BP89.instance.position.set(23.6104736328125, 0, 12.246556282043457);
  }

  controls.update();
  renderer.render(scene, camera);
}

export default animate;
