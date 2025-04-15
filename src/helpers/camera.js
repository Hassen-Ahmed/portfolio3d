export const transformCamera = (camera, sizes, viewSize, renderer) => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  const aspectROnRsize = window.innerWidth / window.innerHeight;

  camera.left = (-aspectROnRsize * viewSize.value) / 2;
  camera.right = (aspectROnRsize * viewSize.value) / 2;
  camera.top = viewSize.value / 2;
  camera.bottom = -viewSize.value / 2;

  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};
