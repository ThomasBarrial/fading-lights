import { useBox } from "@react-three/cannon";
import React from "react";

function Spawn() {
  // Murs gauche / droite
  const [leftWallRef] = useBox(() => ({
    position: [-5, 1.5, 0],
    args: [0.5, 1.2, 10],
  }));

  const [rightWallRef] = useBox(() => ({
    position: [5, 1.5, 0],
    args: [0.5, 1.2, 10],
  }));

  // Mur arrière
  const [backWallRef] = useBox(() => ({
    position: [0, 1.5, 5],
    args: [10, 1.2, 0.5],
  }));

  return (
    <>
      {/* Murs */}
      <mesh ref={leftWallRef} castShadow receiveShadow>
        <boxGeometry args={[0.5, 1.2, 10]} />
        <meshStandardMaterial color="#666666" />
      </mesh>

      <mesh ref={rightWallRef} castShadow receiveShadow>
        <boxGeometry args={[0.5, 1.2, 10]} />
        <meshStandardMaterial color="#666666" />
      </mesh>

      <mesh ref={backWallRef} castShadow receiveShadow>
        <boxGeometry args={[10, 1.2, 0.5]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
    </>
  );
}

export default Spawn;
