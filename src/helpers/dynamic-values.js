export const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

export const viewSize = { value: window.innerWidth < 500 ? 65 : 45 };

export let movementDirection = { value: null };

export const objectsToRotateInLoop = [];
export const clickableObjects = [];

export const wallsClickable = [];
export const wallsBoundary = [];

export let BP89 = {
  instance: null,
  moveDistance: 4,
  moveDuration: 0.5,
  isMoving: false,
  jumpHeight: 2,
  jumpSpeed: 5,
};
