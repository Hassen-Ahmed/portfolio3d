import { intersectObjectNames } from "../constant-values";
import {
  BP89,
  clickableObjects,
  objectsToRotateInLoop,
  wallsBoundary,
  wallsClickable,
} from "../dynamic-values";
import scene from "../../majors/scene";
import * as THREE from "three";

export const glbLoader = (glb) => {
  const models = glb.scene;
  scene.add(models);

  models.traverse((model) => {
    if (model.name.includes("wall-boundary")) {
      model.visible = false;
      wallsBoundary.push(model);
    }

    if (intersectObjectNames.includes(model.name)) {
      model.scale.set(0, 0, 0);
      clickableObjects.push(model);

      const geometryWall = new THREE.BoxGeometry(2, 2, 2);
      const material = new THREE.MeshBasicMaterial({
        opacity: 0,
        visible: false,
      });
      const wall = new THREE.Mesh(geometryWall, material);
      wall.name = model.name;
      wall.position.x = model.position.x;
      wall.position.y = 1;
      wall.position.z = model.position.z;
      scene.add(wall);
      wallsClickable.push(wall);
    }

    if (model.name.includes("wind-turbine-wing")) {
      objectsToRotateInLoop.push(model);
    }

    if (model.name == "BP-89") {
      BP89.instance = model;
    }

    if (model.isMesh) {
      model.receiveShadow = true;
      model.castShadow = true;
    }
  });
};
