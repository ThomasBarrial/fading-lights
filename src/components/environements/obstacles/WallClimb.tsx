import { useBox } from "@react-three/cannon";
import React from "react";

function WallClimb() {
  // Bloc à grimper bas
  const [block1Ref] = useBox(() => ({
    position: [1, 0.1, -8.8],
    args: [4, 2.2, 7],
  }));
  const [block2Ref] = useBox(() => ({
    position: [-2, 0.1, -9.5],
    args: [4, 4.5, 4],
  }));

  const [block3Ref] = useBox(() => ({
    position: [-1, 0.1, -13],
    args: [4, 7.2, 4],
  }));

  const [block4Ref] = useBox(() => ({
    position: [3, 0.1, -14],
    args: [4, 9, 4],
  }));
  return (
    <>
      {/* Bloc à grimper */}
      <mesh ref={block1Ref} castShadow receiveShadow>
        <boxGeometry args={[4, 2.2, 7]} />
        <meshStandardMaterial color="#777777" />
      </mesh>
      <mesh ref={block2Ref} castShadow receiveShadow>
        <boxGeometry args={[4, 4.5, 4]} />
        <meshStandardMaterial color="#777777" />
      </mesh>
      <mesh ref={block3Ref} castShadow receiveShadow>
        <boxGeometry args={[4, 7.2, 4]} />
        <meshStandardMaterial color="#777777" />
      </mesh>
      <mesh ref={block4Ref} castShadow receiveShadow>
        <boxGeometry args={[4, 9, 4]} />
        <meshStandardMaterial color="#777777" />
      </mesh>
    </>
  );
}

export default WallClimb;
