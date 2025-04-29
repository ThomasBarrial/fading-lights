import { useBox } from "@react-three/cannon";
import React, { useMemo } from "react";
import Block from "../Block";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const ROCK_URL =
  "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/rock/model.gltf";

function WallClimb() {
  const rockGLTF = useGLTF(ROCK_URL);
  const rockMesh = rockGLTF.scene.children[0] as THREE.Mesh;

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

  const customMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#B78753", // 🔹 Couleur personnalisée
        roughness: 1,
        metalness: 0,
      }),
    [],
  );

  return (
    <>
      <Block
        arg1={4}
        arg2={2.2}
        arg3={7}
        blockRef={block1Ref}
        rockGroups={[
          {
            offset: [0, 0, -8.4], // position relative au bloc
            items: [
              { position: [0.3, 1.2, -2], scale: 0.2, rotationY: 0.4 },
              { position: [0.5, 1.1, -2.2], scale: 0.1, rotationY: 1.1 },
            ],
          },
          {
            offset: [2, 0, -6], // un autre petit groupe ailleurs
            items: [
              { position: [0, 1, 0], scale: 0.15, rotationY: 0.9 },
              { position: [0.2, 1.1, -0.2], scale: 0.1, rotationY: 0.2 },
              { position: [0.4, 1.1, -0.1], scale: 0.1, rotationY: 0.2 },
            ],
          },
          {
            offset: [-0.4, -1, -5], // un autre petit groupe ailleurs
            items: [
              { position: [0, 1, 0], scale: 0.15, rotationY: 0.9 },
              { position: [0.2, 1.1, -0.2], scale: 0.1, rotationY: 0.2 },
              { position: [0.4, 1.1, -0.1], scale: 0.1, rotationY: 0.2 },
            ],
          },
          {
            offset: [3, -1, -8.4], // position relative au bloc
            items: [
              { position: [0.3, 1.2, -2], scale: 0.2, rotationY: 0.4 },
              { position: [0.5, 1.1, -2.2], scale: 0.1, rotationY: 1.1 },
            ],
          },
        ]}
        rockGeometry={rockMesh.geometry}
        rockMaterial={customMaterial}
      />
      <Block
        arg1={4}
        arg2={4.5}
        arg3={4}
        blockRef={block2Ref}
        rockGroups={[
          {
            offset: [-3, 1.2, -8.6], // position relative au bloc
            items: [
              { position: [0.3, 1.2, -2], scale: 0.16, rotationY: 1.2 },
              { position: [0.5, 1.1, -2.2], scale: 0.1, rotationY: 1.1 },
            ],
          },
          {
            offset: [-3.5, 1.2, -6], // position relative au bloc
            items: [
              { position: [0.3, 1.2, -2.5], scale: 0.1, rotationY: 0.5 },
              { position: [0.3, 1.2, -2], scale: 0.16, rotationY: 0.2 },
              { position: [0.5, 1.1, -2.2], scale: 0.1, rotationY: 1.1 },
            ],
          },
        ]}
        rockGeometry={rockMesh.geometry}
        rockMaterial={customMaterial}
      />
      <Block
        arg1={4}
        arg2={7.2}
        arg3={4}
        blockRef={block3Ref}
        rockGroups={[
          {
            offset: [-2.5, 2.6, -12.2], // position relative au bloc
            items: [
              { position: [0.3, 1.2, -2], scale: 0.16, rotationY: 0.22 },
              { position: [0.5, 1.1, -2.2], scale: 0.1, rotationY: 1.1 },
              { position: [0, 1.1, -1.5], scale: 0.1, rotationY: 1.1 },
            ],
          },
          {
            offset: [-3.5, 1.2, -6], // position relative au bloc
            items: [
              { position: [0.3, 1.2, -2.5], scale: 0.1, rotationY: 0.5 },
              { position: [0.3, 1.2, -2], scale: 0.16, rotationY: 0.2 },
              { position: [0.5, 1.1, -2.2], scale: 0.1, rotationY: 1.1 },
            ],
          },
        ]}
        rockGeometry={rockMesh.geometry}
        rockMaterial={customMaterial}
      />
      <Block
        arg1={4}
        arg2={9}
        arg3={4}
        blockRef={block4Ref}
        rockGroups={[
          {
            offset: [-2.5, 2.6, -12.2], // position relative au bloc
            items: [
              { position: [0.3, 1.2, -2], scale: 0.16, rotationY: 0.22 },
              { position: [0.5, 1.1, -2.2], scale: 0.1, rotationY: 1.1 },
              { position: [0, 1.1, -1.5], scale: 0.1, rotationY: 1.1 },
            ],
          },
          {
            offset: [-3.5, 1.2, -6], // position relative au bloc
            items: [
              { position: [0.3, 1.2, -2.5], scale: 0.1, rotationY: 0.5 },
              { position: [0.3, 1.2, -2], scale: 0.16, rotationY: 0.2 },
              { position: [0.5, 1.1, -2.2], scale: 0.1, rotationY: 1.1 },
            ],
          },
        ]}
        rockGeometry={rockMesh.geometry}
        rockMaterial={customMaterial}
      />
    </>
  );
}

export default WallClimb;
