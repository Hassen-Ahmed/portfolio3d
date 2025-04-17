import * as THREE from "three";
import { sizes } from "../helpers/dynamic-values";
import { myCanvas } from "../helpers/constant-values";
const renderer = new THREE.WebGLRenderer({ canvas: myCanvas, antialias: true });

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.3;

export default renderer;
