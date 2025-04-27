"use client";

import { useBox } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import * as THREE from "three";

export type MovingWallsHandle = {
  wallsRefs: React.RefObject<THREE.Object3D>[];
};

const MovingWallObstacle = forwardRef<MovingWallsHandle>((_, ref) => {
  const CENTER_X = 5.2;
  const BASE_Z = -43.5;
  const AMPLITUDE_X = 2.5;
  const SPEED = 2.5;

  const [floorRef] = useBox(() => ({
    position: [5, 8, -48.5],
    args: [8, 1.5, 20],
    type: "Static",
  }));

  const [leftWallRef] = useBox(() => ({
    position: [-0.5, 9.25, -48.49],
    args: [3, 4, 20],
    type: "Static",
  }));

  const [rightWallRef] = useBox(() => ({
    position: [10.5, 9.25, -48.49],
    args: [3, 4, 20],
    type: "Static",
  }));

  // Murs mouvants
  const [movingWallRef1, api1] = useBox(() => ({
    position: [CENTER_X, 9.25, BASE_Z],
    args: [2.5, 6, 1],
    type: "Kinematic",
  }));

  const [movingWallRef2, api2] = useBox(() => ({
    position: [CENTER_X, 9.25, BASE_Z - 5],
    args: [2.5, 6, 1],
    type: "Kinematic",
  }));

  const [movingWallRef3, api3] = useBox(() => ({
    position: [CENTER_X, 9.25, BASE_Z - 10],
    args: [2.5, 6, 1],
    type: "Kinematic",
  }));

  // Décalage de phase pour chaque mur
  const offset1 = useRef(Math.random() * Math.PI * 2);
  const offset2 = useRef(Math.random() * Math.PI * 2);
  const offset3 = useRef(Math.random() * Math.PI * 2);

  // Expose les refs pour collision detection
  useImperativeHandle(ref, () => ({
    wallsRefs: [movingWallRef1, movingWallRef2, movingWallRef3],
  }));

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    const oscillation1 = Math.sin(t * SPEED + offset1.current) * AMPLITUDE_X;
    const oscillation2 =
      Math.sin(t * (SPEED + 0.5) + offset2.current) * (AMPLITUDE_X * 0.8);
    const oscillation3 =
      Math.sin(t * (SPEED + 1) + offset3.current) * (AMPLITUDE_X * 0.8);

    api1.position.set(CENTER_X + oscillation1, 9.25, BASE_Z);
    api2.position.set(CENTER_X + oscillation2, 9.25, BASE_Z - 5);
    api3.position.set(CENTER_X + oscillation3, 9.25, BASE_Z - 10);
  });

  return (
    <>
      {/* Sol */}
      <mesh ref={floorRef} castShadow receiveShadow>
        <boxGeometry args={[8, 1.5, 20]} />
        <meshStandardMaterial color="#555555" />
      </mesh>

      {/* Murs fixes */}
      <mesh ref={leftWallRef} castShadow receiveShadow>
        <boxGeometry args={[3, 4, 20]} />
        <meshStandardMaterial color="#555555" />
      </mesh>

      <mesh ref={rightWallRef} castShadow receiveShadow>
        <boxGeometry args={[3, 4, 20]} />
        <meshStandardMaterial color="#555555" />
      </mesh>

      {/* Murs mouvants */}
      <mesh ref={movingWallRef1} castShadow receiveShadow>
        <boxGeometry args={[2.5, 6, 1]} />
        <meshStandardMaterial color="#aa3333" />
      </mesh>

      <mesh ref={movingWallRef2} castShadow receiveShadow>
        <boxGeometry args={[2.5, 6, 1]} />
        <meshStandardMaterial color="#aa3333" />
      </mesh>

      <mesh ref={movingWallRef3} castShadow receiveShadow>
        <boxGeometry args={[2.5, 6, 1]} />
        <meshStandardMaterial color="#aa3333" />
      </mesh>
    </>
  );
});

MovingWallObstacle.displayName = "MovingWallObstacle";
export default MovingWallObstacle;
