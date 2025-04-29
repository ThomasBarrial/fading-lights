"use client";

import { usePlane } from "@react-three/cannon";
import WallClimb from "./environements/obstacles/WallClimb";
import JumpBridge from "./environements/obstacles/JumpBridge";
import WallClimb2 from "./environements/obstacles/WallClimb2";
import MovingWallObstacle, {
  MovingWallsHandle,
} from "./environements/obstacles/MovingWallObstacle";
import { RefObject } from "react";
import WallClimb3 from "./environements/obstacles/WallClimb3";
import ClosingWallsTunnel, {
  ClosingWallsHandle,
} from "./environements/obstacles/ClosingWallTunnel";
import Level1Platforms from "./environements/obstacles/Level1Plateforms";
import NatureBackground from "./environements/nature/NatureBackground";
import RocksBackground from "./environements/nature/RockBackground";

function EnvironmentTest({
  movingWallsRef,
  closingWallsRef,
  handleBoostCollect,
}: {
  movingWallsRef: RefObject<MovingWallsHandle | null>;
  closingWallsRef: RefObject<ClosingWallsHandle | null>;
  handleBoostCollect: () => void;
}) {
  // Sol solide
  const [floorRef] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
  }));

  // Chemin
  const [pathRef] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0.01, -3],
  }));

  return (
    <>
      {/* Sol */}
      <mesh ref={floorRef} receiveShadow>
        <planeGeometry args={[200, 280]} />
        <meshStandardMaterial color="#5E845E" />
      </mesh>

      <mesh ref={pathRef} receiveShadow>
        <planeGeometry args={[5, 10]} />
        <meshStandardMaterial color="#F1BD85" />
      </mesh>
      {/* <Spawn /> */}
      <WallClimb />
      <JumpBridge />
      <WallClimb2 />
      <MovingWallObstacle ref={movingWallsRef} />
      <WallClimb3 onBoostCollect={handleBoostCollect} />
      <ClosingWallsTunnel ref={closingWallsRef} />
      <Level1Platforms />
      <NatureBackground />
      <RocksBackground />
    </>
  );
}

export default EnvironmentTest;
