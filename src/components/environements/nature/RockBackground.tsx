"use client";

import LODInstance from "@/utils/LODInstance";
import { useGLTF, Instances } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import * as THREE from "three";

const ROCK_URL =
  "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/rock/model.gltf";

export default function RocksBackground() {
  const { scene } = useGLTF(ROCK_URL);

  const rocks = useMemo(() => {
    const array = [];
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 60 - 20;
      const z = Math.random() * 200 - 130;
      if (x > -4 && x < 12 && z > -110 && z < 10) {
        i--;
        continue;
      }
      array.push({
        position: [x, 0, z] as [number, number, number],
        scale: 0.05 + Math.random() * 0.3,
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
    <Suspense fallback={null}>
      <Instances
        geometry={(scene.children[0] as THREE.Mesh).geometry}
        material={(scene.children[0] as THREE.Mesh).material}
        limit={500}
        castShadow
        receiveShadow
      >
        {rocks.map((rock, idx) => (
          <LODInstance
            key={idx}
            position={rock.position}
            rotation={rock.rotation}
            scale={rock.scale}
            nearDistance={5}
            farDistance={120}
          />
        ))}
      </Instances>
    </Suspense>
  );
}
