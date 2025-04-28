"use client";

import LODInstance from "@/utils/LODInstance";
import { useGLTF, Instances } from "@react-three/drei";
import { Suspense, useEffect, useMemo } from "react";
import * as THREE from "three";

const TREE_URL =
  "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tree-beech/model.gltf";

export default function NatureBackground() {
  return (
    <Suspense fallback={null}>
      <Trees />
    </Suspense>
  );
}

function Trees() {
  const { scene } = useGLTF(TREE_URL);

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      });
    }
  }, [scene]);

  const trees = useMemo(() => {
    const array = [];
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * 60 - 20;
      const z = Math.random() * 200 - 130;
      if (x > -4 && x < 12 && z > -110 && z < 10) {
        i--;
        continue;
      }
      array.push({
        position: [x, 0, z] as [number, number, number],
        scale: 0.3 + Math.random() * 0.15,
        rotation: [0, Math.random() * Math.PI * 2, 0] as [
          number,
          number,
          number,
        ],
      });
    }
    return array;
  }, []);

  if (!scene.children[0]) return null;

  return (
    <Instances
      geometry={(scene.children[0] as THREE.Mesh).geometry}
      material={(scene.children[0] as THREE.Mesh).material}
      limit={500}
      castShadow
      receiveShadow
    >
      {trees.map((tree, idx) => (
        <LODInstance
          key={idx}
          position={tree.position}
          rotation={tree.rotation}
          scale={tree.scale}
          nearDistance={10} // 🌟 Apparait proche
          farDistance={150} // 🌟 Disparait plus loin
        />
      ))}
    </Instances>
  );
}
