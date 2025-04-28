/// LODInstance.tsx
"use client";

import { useThree } from "@react-three/fiber";
import { Instance } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

export type LODInstanceProps = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  nearDistance?: number; // Distance minimum pour apparaître
  farDistance?: number; // Distance maximum pour disparaitre
};

export default function LODInstance({
  position,
  rotation,
  scale,
  nearDistance = 20,
  farDistance = 120,
}: LODInstanceProps) {
  const { camera } = useThree();

  const visible = useMemo(() => {
    const dist = new THREE.Vector3(...position).distanceTo(camera.position);
    return dist > nearDistance && dist < farDistance;
  }, [camera.position, position, nearDistance, farDistance]);

  if (!visible) return null;

  return (
    <Instance
      position={position}
      rotation={rotation}
      scale={scale}
      frustumCulled={false}
    />
  );
}
