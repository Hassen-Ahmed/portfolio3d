export const modalToggler = (intersects, clickableObjects, element) => {
  if (intersects.length > 0) {
    if (intersects[0].object.parent.name === "pointer-about-me") {
      element[0].style.display = "block";
    } else if (intersects[0].object.parent.name === "pointer-contact") {
      element[2].style.display = "block";
    } else if (intersects[0].object.parent.name === "pointer-projects") {
      element[3].style.display = "block";
    } else if (intersects[0].object.parent.name === "pointer-skills") {
      element[1].style.display = "block";
    }
  } else {
    clickableObjects.forEach((clickableObject) => {
      clickableObject.scale.set(0, 0, 0);
    });
  }
};
