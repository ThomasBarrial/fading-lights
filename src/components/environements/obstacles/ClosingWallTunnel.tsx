"use client";

import { useBox } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import React, { forwardRef, useImperativeHandle } from "react";
import * as THREE from "three";

// Type exposé pour récupérer les murs (utile pour collision)
export type ClosingWallsHandle = {
  wallsRefs: React.RefObject<THREE.Object3D>[];
};

const ClosingWallsTunnel = forwardRef<ClosingWallsHandle>((_, ref) => {
  const CENTER_X = 4.4;
  const BASE_Z = -85.5;
  const WALL_DISTANCE = 3;
  const WALL_HEIGHT = 5;
  const SPEED = 2.5;
  const AMPLITUDE = 1; // Distance d'oscillation des murs

  // Sol fixe du tunnel
  const [floorRef] = useBox(() => ({
    position: [CENTER_X, 15, BASE_Z],
    args: [8, 1, 16],
    type: "Static",
  }));

  // Murs gauche et droit qui se ferment
  const [leftWallRef, leftApi] = useBox(() => ({
    position: [CENTER_X - WALL_DISTANCE, 18, -83],
    args: [3, WALL_HEIGHT, 5],
    type: "Kinematic",
  }));

  const [rightWallRef, rightApi] = useBox(() => ({
    position: [CENTER_X + WALL_DISTANCE, 18, -83],
    args: [3, WALL_HEIGHT, 5],
    type: "Kinematic",
  }));

  // Animation oscillante des murs
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const leftX = 5.5 - WALL_DISTANCE + Math.sin(t * SPEED) * AMPLITUDE;
    const rightX = 3.8 + WALL_DISTANCE - Math.sin(t * SPEED) * AMPLITUDE;

    leftApi.position.set(leftX, 18, -83);
    rightApi.position.set(rightX, 18, -83);
  });

  // Expose les murs via le ref pour HomeCanvas
  useImperativeHandle(ref, () => ({
    wallsRefs: [leftWallRef, rightWallRef],
  }));

  return (
    <>
      {/* Sol */}
      <mesh ref={floorRef} castShadow receiveShadow>
        <boxGeometry args={[8, 1, 16]} />
        <meshStandardMaterial color="#444444" />
      </mesh>

      {/* Murs mobiles */}
      <mesh ref={leftWallRef} castShadow receiveShadow>
        <boxGeometry args={[2, WALL_HEIGHT, 5]} />
        <meshStandardMaterial color="#aa3333" />
      </mesh>

      <mesh ref={rightWallRef} castShadow receiveShadow>
        <boxGeometry args={[2, WALL_HEIGHT, 5]} />
        <meshStandardMaterial color="#aa3333" />
      </mesh>
    </>
  );
});

ClosingWallsTunnel.displayName = "ClosingWallsTunnel";
export default ClosingWallsTunnel;
