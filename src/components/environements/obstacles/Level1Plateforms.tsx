"use client";

import { useBox } from "@react-three/cannon";
import React from "react";

function Level1Platforms() {
  // Plateforme 1
  const [platform1Ref] = useBox(() => ({
    position: [2, 15, -96],
    args: [3, 2.5, 3],
    type: "Static",
  }));

  // Plateforme 2
  const [platform2Ref] = useBox(() => ({
    position: [7, 15.6, -99],
    args: [3, 3, 6],
    type: "Static",
  }));

  // Plateforme 3
  const [platform3Ref] = useBox(() => ({
    position: [2.2, 16, -103],
    args: [3, 4, 3],
    type: "Static",
  }));

  // Grande plateforme finale
  const [finalPlatformRef] = useBox(() => ({
    position: [3, 0, -110],
    args: [3, 34, 5],
    type: "Static",
  }));

  return (
    <>
      <mesh ref={platform1Ref} castShadow receiveShadow>
        <boxGeometry args={[3, 2.5, 3]} />
        <meshStandardMaterial color="#3366aa" />
      </mesh>

      <mesh ref={platform2Ref} castShadow receiveShadow>
        <boxGeometry args={[3, 3, 6]} />
        <meshStandardMaterial color="#3366aa" />
      </mesh>

      <mesh ref={platform3Ref} castShadow receiveShadow>
        <boxGeometry args={[3, 4, 3]} />
        <meshStandardMaterial color="#3366aa" />
      </mesh>

      <mesh ref={finalPlatformRef} castShadow receiveShadow>
        <boxGeometry args={[10, 34, 5]} />
        <meshStandardMaterial color="#44aa44" />
      </mesh>
    </>
  );
}

export default Level1Platforms;
