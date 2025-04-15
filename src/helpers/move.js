export const BP89OnMove = (event, THREE, BP89, camera, moveBP89) => {
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
