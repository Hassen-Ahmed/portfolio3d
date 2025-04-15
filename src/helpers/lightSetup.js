export const lightSetup = (scene, light) => {
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
};
