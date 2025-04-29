import React, { useMemo } from "react";
import { RoundedBoxGeometry } from "three/examples/jsm/Addons.js";
import * as THREE from "three";

interface IProps {
  arg1: number;
  arg2: number;
  arg3: number;
  blockRef: React.RefObject<THREE.Object3D<THREE.Object3DEventMap>>;
  rockGroups?: RockGroup[];
  rockGeometry?: THREE.BufferGeometry;
  rockMaterial?: THREE.Material | THREE.Material[];
}

export type RockGroup = {
  offset?: [number, number, number]; // Position du groupe par rapport au bloc
  items: {
    position: [number, number, number];
    scale: number;
    rotationY: number;
  }[];
};

function Block({
  arg1,
  arg2,
  arg3,
  blockRef,
  rockGroups,
  rockGeometry,
  rockMaterial,
}: IProps) {
  const materials = useMemo(
    () => [
      new THREE.MeshStandardMaterial({ color: "#B78753" }),
      new THREE.MeshStandardMaterial({ color: "#D49B5E" }),
    ],
    [],
  );

  const geometry = useMemo(() => {
    const geom = new RoundedBoxGeometry(arg1, arg2, arg3, 4, 0.3);
    geom.groups.forEach((group) => {
      group.materialIndex = 0;
    });
    if (geom.groups[2]) {
      geom.groups[2].materialIndex = 1;
    }
    geom.computeVertexNormals();
    return geom;
  }, [arg1, arg2, arg3]);

  return (
    <group>
      <mesh
        ref={blockRef}
        geometry={geometry}
        material={materials}
        castShadow
        receiveShadow
      />
      {rockGroups?.map((group, gIdx) => (
        <group key={gIdx} position={group.offset || [0, 0, 0]}>
          {group.items.map((rock, idx) => (
            <mesh
              key={idx}
              geometry={rockGeometry}
              material={rockMaterial}
              position={rock.position}
              rotation={[0, rock.rotationY, 0]}
              scale={rock.scale}
              castShadow
              receiveShadow
            />
          ))}
        </group>
      ))}
    </group>
  );
}

export default Block;
