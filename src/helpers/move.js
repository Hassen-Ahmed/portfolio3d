import * as THREE from "three";
import { gsap } from "gsap/gsap-core";
import { BP89, movementDirection, viewSize } from "./dynamic-values";
import { cubeBB, wallBBBoundary, wallBBsClickables } from "./constant-values";
import camera from "../majors/camera";

export const moveBP89 = (targetPosition, targetRotationY) => {
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
};

export const onBP89OnMove = (event, camera) => {
  const action = event?.target?.dataset.action;

  if (action === "speed-up" && BP89.jumpSpeed < 10) BP89.jumpSpeed += 1;

  if (action === "speed-down" && BP89.jumpSpeed > 2) BP89.jumpSpeed -= 1;

  if (action === "zoom-in" && camera.zoom < 2.2) {
    camera.zoom += 0.1;
    camera.updateProjectionMatrix();
  }

  if (action === "zoom-out") {
    camera.zoom -= 0.1;
    camera.updateProjectionMatrix();
  }

  if (BP89.isMoving) return;

  const targetPosition = new THREE.Vector3().copy(BP89.instance.position);
  let targetRotationY = 0;

  switch (event?.key?.toLowerCase() || action) {
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
};

export const onMove = (event) => {
  movementDirection.value =
    event?.key?.toLowerCase() ?? event?.target?.dataset.action;

  onBP89OnMove(event, camera);
};

export const onCollusion = (
  wallsBoundary,
  wallsClickable,
  clickableObjects
) => {
  cubeBB.setFromObject(BP89.instance);

  wallsClickable.forEach((wall, i) => {
    wallBBsClickables[i].setFromObject(wall);
    wallBBsClickables[i].expandByScalar(0.3);

    if (cubeBB.intersectsBox(wallBBsClickables[i])) {
      clickableObjects.forEach((item) => {
        if (wall.name === item.name) {
          item.scale.set(2, 2, 2);
        }
      });
    }
  });

  wallsBoundary.forEach((boundary, i) => {
    wallBBBoundary[i].setFromObject(boundary);
    wallBBBoundary[i].expandByScalar(0.3);

    if (cubeBB.intersectsBox(wallBBBoundary[i])) {
      switch (movementDirection.value) {
        case "arrowup":
        case "w":
        case "up-arrow":
          BP89.instance.position.z += 2;
          break;

        case "arrowdown":
        case "s":
        case "down-arrow":
          BP89.instance.position.z -= 2;
          break;

        case "arrowleft":
        case "a":
        case "left-arrow":
          BP89.instance.position.x += 2;
          break;

        case "arrowright":
        case "d":
        case "right-arrow":
          BP89.instance.position.x -= 2;
          break;
        default:
          break;
      }
    }
  });
};
