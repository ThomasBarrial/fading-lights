import { useBox } from "@react-three/cannon";
import React from "react";

function JumpBridge() {
  const [block1Ref] = useBox(() => ({
    position: [3, 4.1, -18],
    args: [4, 1, 4],
  }));
  const [block2Ref] = useBox(() => ({
    position: [3, 4.1, -26],
    args: [4, 1, 4],
  }));
  const [block3Ref] = useBox(() => ({
    position: [3, 0.1, -30],
    args: [4, 9, 4],
  }));

  // Ajout de la rampe physique invisible ✨
  const [ramp1Ref] = useBox(() => ({
    position: [3, 4.6, -16], // Entre block2 (-26) et block3 (-30)
    args: [4, 0.2, 8], // Très fin en hauteur
  }));

  // Ajout de la rampe physique invisible ✨
  const [ramp2Ref] = useBox(() => ({
    position: [3, 4.6, -28], // Entre block2 (-26) et block3 (-30)

    args: [4, 0.2, 8], // Très fin en hauteur
  }));

  return (
    <>
      <mesh ref={ramp1Ref} receiveShadow>
        <boxGeometry args={[4, 0.2, 8]} />
        <meshStandardMaterial color="#777722" opacity={0} />
      </mesh>
      {/* Blocs visibles */}
      <mesh ref={block1Ref} castShadow receiveShadow>
        <boxGeometry args={[4, 1, 4]} />
        <meshStandardMaterial color="#777726" />
      </mesh>

      <mesh ref={block2Ref} castShadow receiveShadow>
        <boxGeometry args={[4, 1, 4]} />
        <meshStandardMaterial color="#777726" />
      </mesh>

      <mesh ref={block3Ref} castShadow receiveShadow>
        <boxGeometry args={[4, 9, 4]} />
        <meshStandardMaterial color="#777777" />
      </mesh>

      {/* Rampe invisible */}
      <mesh ref={ramp2Ref} receiveShadow>
        <boxGeometry args={[4, 0.2, 8]} />
        <meshStandardMaterial color="#777711" opacity={0} />
      </mesh>
    </>
  );
}

export default JumpBridge;
