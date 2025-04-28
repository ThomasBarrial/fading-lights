"use client";

import { useThree, useFrame } from "@react-three/fiber";
import { RefObject } from "react";
import * as THREE from "three";

type CameraControllerProps = {
  playerPositionRef: RefObject<[number, number, number]>;
};

function CameraController({ playerPositionRef }: CameraControllerProps) {
  const { camera } = useThree();

  const idealOffset = new THREE.Vector3(5, 8, 5);
  const tempVec = new THREE.Vector3();

  useFrame((state, delta) => {
    // console.log(playerPositionRef.current);
    if (!playerPositionRef.current) return;

    const [x, y, z] = playerPositionRef.current;

    const desiredPosition = new THREE.Vector3(x, y, z).add(idealOffset);

    // Super smooth
    const lerpFactor = 1 - Math.pow(0.1, delta);

    tempVec.lerpVectors(camera.position, desiredPosition, lerpFactor);

    camera.position.copy(tempVec);

    // Regarde légèrement au-dessus du joueur
    camera.lookAt(new THREE.Vector3(x, y + 1, z));
  });

  return null;
}

export default CameraController;
