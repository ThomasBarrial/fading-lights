"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

type BoostProps = {
  position: [number, number, number];
  onCollect: () => void;
};

export default function Boost({ position, onCollect }: BoostProps) {
  const ref = useRef<THREE.Mesh>(null);
  const [collected, setCollected] = useState(false);

  useFrame(() => {
    if (!ref.current) return;

    // Rotation
    ref.current.rotation.y += 0.01;

    // Flottement autour de sa vraie position d'origine
    const baseY = position[1]; // 👈 on prend la Y de base donnée en props
    ref.current.position.y = baseY + Math.sin(Date.now() * 0.002) * 0.2;
  });

  const handleCollect = () => {
    setCollected(true);
    onCollect();
  };

  if (collected) return null;

  return (
    <mesh
      ref={ref}
      position={position}
      scale={[0.5, 0.5, 0.5]}
      onClick={handleCollect} // clique = ramasse aussi pour test rapide
    >
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial emissive="aqua" color="white" />
    </mesh>
  );
}
