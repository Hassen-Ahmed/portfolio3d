import * as THREE from "three";
export const circles = document.querySelector(".circles");
export const enterBtn = document.querySelector(".enter-btn");
export const landingPageContainer = document.getElementById(
  "landing-page--container"
);

export const myCanvas = document.getElementById("my-canvas");

export const aboutMe = document.getElementById("about-me--container");
export const aboutMeCloseBtn = document.querySelector(".about-me--close-btn");
export const skillsElem = document.getElementById("skills--container");
export const skillsCloseBtn = document.querySelector(".skills--close-btn");
export const contactsElem = document.getElementById("contacts--container");
export const contactsCloseBtn = document.querySelector(".contacts--close-btn");
export const projectsElem = document.getElementById("projects--container");
export const projectsCloseBtn = document.querySelector(".projects--close-btn");

export const controllers = document.getElementsByClassName("controller");

export const intersectObjectNames = [
  "pointer-about-me",
  "pointer-contact",
  "pointer-projects",
  "pointer-skills",
];

export const cameraOffset = new THREE.Vector3(40, 40, 40);
export const pointer = new THREE.Vector2(1, 1);

export const cubeBB = new THREE.Box3();
export const wallBBBoundary = Array(12).fill(new THREE.Box3());
export const wallBBsClickables = Array(4).fill(new THREE.Box3());
