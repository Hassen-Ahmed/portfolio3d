export const modalToggler = (intersects, clickableObjects, element) => {
  if (intersects.length > 0) {
    if (intersects[0].object.parent.name === "pointer-about-me") {
      console.log("about me");
      element[0].style.display = "block";
    } else if (intersects[0].object.parent.name === "pointer-contact") {
      console.log("contact");
      element[2].style.display = "block";
    } else if (intersects[0].object.parent.name === "pointer-projects") {
      console.log("projects");
    } else if (intersects[0].object.parent.name === "pointer-skills") {
      element[1].style.display = "block";
      console.log("skills");
    }
  } else {
    clickableObjects.forEach((clickableObject) => {
      clickableObject.scale.set(0, 0, 0);
    });
  }
};
