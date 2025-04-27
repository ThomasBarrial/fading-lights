import Boost from "@/components/Boost";
import { useBox } from "@react-three/cannon";
import React from "react";

function WallClimb3({ onBoostCollect }: { onBoostCollect: () => void }) {
  // Sol géant
  const [platformRef] = useBox(() => ({
    position: [5, 8.5, -64.5], // ✨ Ajuste la position selon ton level design
    args: [20, 2, 12], // ✨ Ajuste la position selon ton level design
  }));

  // Mur facile (boosté)

  const [easyWallRef1] = useBox(() => ({
    position: [8, 11, -72], // ✨ décalé à gauche
    args: [5, 4.5, 5], // plus bas
    type: "Static",
  }));

  const [easyWallRef2] = useBox(() => ({
    position: [4, 11, -75], // ✨ décalé à gauche
    args: [5, 7.5, 5], // plus bas
    type: "Static",
  }));
  // Mur difficile (sans boost)
  const [hardWallRef] = useBox(() => ({
    position: [3, 10, -70], // ✨ décalé à gauche
    args: [5, 1.5, 5], // plus bas
    type: "Static",
  }));
  const [hardWallRef2] = useBox(() => ({
    position: [1, 10, -73], // ✨ décalé à gauche
    args: [5, 4, 5], // plus bas
    type: "Static",
  }));
  return (
    <>
      {/* Plateforme */}
      <mesh ref={platformRef} castShadow receiveShadow>
        <boxGeometry args={[20, 2, 12]} />
        <meshStandardMaterial color="#222555" />
      </mesh>
      {/* Boost au centre */}
      <Boost position={[7, 10, -65]} onCollect={onBoostCollect} />
      {/* Mur facile */}
      <mesh ref={easyWallRef1} castShadow receiveShadow>
        <boxGeometry args={[5, 4.5, 5]} />
        <meshStandardMaterial color="#3355aa" />
      </mesh>
      <mesh ref={easyWallRef2} castShadow receiveShadow>
        <boxGeometry args={[5, 7.5, 5]} />
        <meshStandardMaterial color="#3355aa" />
      </mesh>
      {/* Mur difficile */}
      <mesh ref={hardWallRef} castShadow receiveShadow>
        <boxGeometry args={[5, 1.5, 5]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
      <mesh ref={hardWallRef2} castShadow receiveShadow>
        <boxGeometry args={[5, 4, 5]} />
        <meshStandardMaterial color="#555555" />
      </mesh>{" "}
    </>
  );
}

export default WallClimb3;
