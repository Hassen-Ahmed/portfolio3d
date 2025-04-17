import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import camera from "./camera";
import renderer from "./renderer";

const controls = new OrbitControls(camera, renderer.domElement);
controls.minZoom = 0.22; // we don't need maxZoom
controls.enableRotate = false;
controls.enableZoom = true;
controls.enablePan = true;

export default controls;
