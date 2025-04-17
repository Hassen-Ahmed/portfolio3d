import * as THREE from "three";
import { sizes, viewSize } from "../helpers/dynamic-values";
import renderer from "./renderer";

const aspectRatio = sizes.width / sizes.height;

const camera = new THREE.OrthographicCamera(
  (-aspectRatio * viewSize.value) / 2,
  (aspectRatio * viewSize.value) / 2,
  viewSize.value / 2,
  -viewSize.value / 2
);

camera.zoom = 1.2;
camera.updateProjectionMatrix();

export const transformCamera = () => {
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

export default camera;
