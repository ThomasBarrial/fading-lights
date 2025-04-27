import { useBox } from "@react-three/cannon";
import React from "react";

function WallClimb2() {
  const [block1Ref] = useBox(() => ({
    position: [3, 0.1, -35],
    args: [9, 11, 6],
  }));

  const [block2Ref] = useBox(() => ({
    position: [1, 6, -38],
    args: [4, 2.2, 7],
  }));
  const [block3Ref] = useBox(() => ({
    position: [5, 6.9, -40],
    args: [4, 2.6, 7],
  }));

  // Ajout d
  return (
    <>
      <mesh ref={block1Ref} castShadow receiveShadow>
        <boxGeometry args={[9, 11, 6]} />
        <meshStandardMaterial color="#777777" />
      </mesh>
      <mesh ref={block2Ref} castShadow receiveShadow>
        <boxGeometry args={[4, 2.2, 7]} />
        <meshStandardMaterial color="#777777" />
      </mesh>
      <mesh ref={block3Ref} castShadow receiveShadow>
        <boxGeometry args={[4, 2.6, 7]} />
        <meshStandardMaterial color="#777777" />
      </mesh>
    </>
  );
}

export default WallClimb2;
