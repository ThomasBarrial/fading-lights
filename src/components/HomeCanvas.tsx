"use client";

import { Canvas } from "@react-three/fiber";
import Player, { PlayerHandle } from "./Player";
import CameraController from "./CameraController";
import { useEffect, useRef, useState } from "react";
import { Physics } from "@react-three/cannon";
import { OrthographicCamera } from "@react-three/drei";
import EnvironmentTest from "./EnvironnementTest";
import { MovingWallsHandle } from "./environements/obstacles/MovingWallObstacle";
import { ClosingWallsHandle } from "./environements/obstacles/ClosingWallTunnel";

function HomeCanvas() {
  const playerRef = useRef<PlayerHandle>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const movingWallsRef = useRef<MovingWallsHandle>(null);
  const closingWallsRef = useRef<ClosingWallsHandle>(null);

  const [isDashing, setIsDashing] = useState(false);
  const [isBoosting, setIsBoosting] = useState(false);
  const [boostsCollected, setBoostsCollected] = useState(0);
  const [addictionLevel, setAddictionLevel] = useState(0);

  const handleBoostCollect = () => {
    setBoostsCollected((prev) => prev + 1);
    setAddictionLevel((prev) => prev + 1);
    setIsBoosting(true);
    setTimeout(() => setIsBoosting(false), 5000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current) {
        setIsCameraReady(true); // ✅ caméra prête seulement quand Player est prêt
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  console.log("isDashing", isDashing);
  console.log("boostsCollected", boostsCollected);

  return (
    <div className="relative w-screen h-screen">
      <Canvas shadows gl={{ logarithmicDepthBuffer: false }}>
        <color attach="background" args={["#D6E892"]} />
        <fog attach="fog" args={["#D6E892", 10, 30]} />
        <OrthographicCamera
          makeDefault
          position={[10, 10, 10]}
          zoom={50}
          near={-100}
          far={500}
        />
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[30, 100, 0]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={4096}
          shadow-mapSize-height={4096}
          shadow-camera-near={1}
          shadow-camera-far={300}
          shadow-camera-left={-120}
          shadow-camera-right={120}
          shadow-camera-top={120}
          shadow-camera-bottom={-120}
        />
        <ambientLight intensity={0.8} />
        <Physics gravity={[0, -30, 0]}>
          <EnvironmentTest
            closingWallsRef={closingWallsRef}
            movingWallsRef={movingWallsRef}
            handleBoostCollect={handleBoostCollect}
          />

          <Player
            ref={playerRef}
            onDash={setIsDashing}
            addictionLevel={addictionLevel}
            isBoosting={isBoosting}
            movingWallsRef={movingWallsRef}
            closingWallsRef={closingWallsRef}
          />

          {isCameraReady && playerRef.current && (
            <CameraController
              playerPositionRef={playerRef.current.positionRef}
            />
          )}
        </Physics>
      </Canvas>
    </div>
  );
}

export default HomeCanvas;
