"use client";

import { useThree, useFrame } from "@react-three/fiber";
import { RefObject, useRef } from "react";
import * as THREE from "three";

type CameraControllerProps = {
  playerPositionRef: RefObject<[number, number, number]>;
};

function CameraController({ playerPositionRef }: CameraControllerProps) {
  const { camera } = useThree();

  const idealOffset = new THREE.Vector3(5, 8, 5); // Position relative à viser
  const smoothedPosition = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    if (!playerPositionRef.current) return;

    // 🧠 Position visée : position du joueur + offset
    const [x, y, z] = playerPositionRef.current;
    const targetPosition = new THREE.Vector3(x, y, z).add(idealOffset);

    // ✨ Interpolation très douce (caméra suit un point virtuel lissé)
    smoothedPosition.current.lerp(targetPosition, 1 - Math.pow(0.01, delta));

    camera.position.copy(smoothedPosition.current);

    // 🎯 La caméra regarde légèrement au-dessus du joueur
    camera.lookAt(new THREE.Vector3(x, y + 1, z));
  });

  return null;
}

export default CameraController;
