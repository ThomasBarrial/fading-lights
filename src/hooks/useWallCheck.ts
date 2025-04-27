"use client";

import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

export function useWallCheck() {
  const { scene } = useThree();
  const raycaster = useRef(new THREE.Raycaster());

  const checkWall = (origin: THREE.Vector3, direction: THREE.Vector3) => {
    raycaster.current.set(origin, direction.normalize());
    const intersects = raycaster.current.intersectObjects(scene.children, true);

    if (intersects.length > 0 && intersects[0].distance < 0.6) {
      return true;
    }
    return false;
  };

  return { checkWall };
}
