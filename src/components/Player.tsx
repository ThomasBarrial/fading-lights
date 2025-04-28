"use client";

import { useSphere } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import * as THREE from "three";
import { MovingWallsHandle } from "./environements/obstacles/MovingWallObstacle";
import { ClosingWallsHandle } from "./environements/obstacles/ClosingWallTunnel";
import { useWallCheck } from "@/hooks/useWallCheck";

const BASE_MOVE_SPEED = 15;
const BASE_JUMP_FORCE = 15;
const BOOST_MULTIPLIER_SPEED = 1.5;
const BOOST_MULTIPLIER_JUMP = 2.3;
const DASH_MULTIPLIER = 2.5;
const DASH_DURATION = 0.2;
const DASH_COOLDOWN = 1.5;

type PlayerProps = {
  onDash?: (dashing: boolean) => void;
  isBoosting?: boolean;
  addictionLevel?: number;
  movingWallsRef?: React.RefObject<MovingWallsHandle | null>;
  closingWallsRef?: React.RefObject<ClosingWallsHandle | null>;
};

export type PlayerHandle = {
  api: ReturnType<typeof useSphere>[1];
  positionRef: React.RefObject<[number, number, number]>;
};

const Player = forwardRef<PlayerHandle, PlayerProps>(
  (
    { onDash, isBoosting, addictionLevel, movingWallsRef, closingWallsRef },
    ref,
  ) => {
    const [playerRef, api] = useSphere(() => ({
      mass: 1,
      position: [0, 1, 0],
      args: [0.45],
      fixedRotation: true,
      linearDamping: 0.98,
    }));

    const { checkWall } = useWallCheck();

    const keysPressed = useRef<{ [key: string]: boolean }>({});
    const isDashing = useRef(false);
    const dashTimer = useRef(0);
    const dashCooldownTimer = useRef(0);
    const [isRespawning, setIsRespawning] = useState(false);

    const direction = useRef(new THREE.Vector3());
    const velocity = useRef(new THREE.Vector3());
    const [isGrounded, setIsGrounded] = useState(false);

    const positionRef = useRef<[number, number, number]>([0, 0, 0]);

    useImperativeHandle(ref, () => ({
      api,
      positionRef,
    }));

    useEffect(() => {
      const unsubscribe = api.velocity.subscribe((v) => {
        velocity.current.set(v[0], v[1], v[2]);
        setIsGrounded(Math.abs(v[1]) < 0.05);
      });
      return () => unsubscribe();
    }, [api.velocity]);

    useEffect(() => {
      const unsubscribe = api.position.subscribe((v) => {
        positionRef.current = [v[0], v[1], v[2]];
      });
      return () => unsubscribe();
    }, [api.position]);

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        keysPressed.current[e.key.toLowerCase()] = true;
      };
      const handleKeyUp = (e: KeyboardEvent) => {
        keysPressed.current[e.key.toLowerCase()] = false;
      };
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
      };
    }, []);

    const respawn = (position: [number, number, number]) => {
      setIsRespawning(true);
      api.velocity.set(0, 0, 0);
      api.angularVelocity.set(0, 0, 0);
      api.position.set(position[0], position[1], position[2]);
      setTimeout(() => {
        setIsRespawning(false);
      }, 1000);
    };

    const checkCollisionWithWalls = (
      wallsRefs: React.RefObject<THREE.Object3D>[],
      respawnPosition: [number, number, number],
    ) => {
      if (!playerRef.current) return false;

      const playerBox = new THREE.Box3().setFromObject(playerRef.current);

      for (const wallRef of wallsRefs) {
        if (!wallRef.current) continue;
        const wallBox = new THREE.Box3().setFromObject(wallRef.current);

        if (playerBox.intersectsBox(wallBox)) {
          respawn(respawnPosition);
          return true;
        }
      }
      return false;
    };

    useFrame((state, delta) => {
      if (!playerRef.current || isRespawning) return;

      const boostFactorSpeed = isBoosting ? BOOST_MULTIPLIER_SPEED : 1;
      const boostFactorJump = isBoosting ? BOOST_MULTIPLIER_JUMP : 1;
      const moveSpeed =
        BASE_MOVE_SPEED *
        boostFactorSpeed *
        Math.max(0.5, 1 - (addictionLevel ?? 0) * 0.05);

      const jumpForce =
        BASE_JUMP_FORCE *
        boostFactorJump *
        Math.max(0.5, 1 - (addictionLevel ?? 0) * 0.05);

      direction.current.set(0, 0, 0);

      if (keysPressed.current["z"]) direction.current.z -= 1;
      if (keysPressed.current["s"]) direction.current.z += 1;
      if (keysPressed.current["q"]) direction.current.x -= 1;
      if (keysPressed.current["d"]) direction.current.x += 1;

      direction.current.normalize();

      const playerPos = new THREE.Vector3(
        positionRef.current[0],
        positionRef.current[1],
        positionRef.current[2],
      );

      if (checkWall(playerPos, direction.current)) {
        direction.current.set(0, 0, 0);
      }

      if (
        keysPressed.current["shift"] &&
        dashCooldownTimer.current <= 0 &&
        !isDashing.current
      ) {
        isDashing.current = true;
        dashTimer.current = DASH_DURATION;
        dashCooldownTimer.current = DASH_COOLDOWN;
        onDash?.(true);
      }

      let finalSpeed = moveSpeed;
      if (isDashing.current) {
        dashTimer.current -= delta;
        if (dashTimer.current > 0) {
          finalSpeed = moveSpeed * DASH_MULTIPLIER;
        } else {
          isDashing.current = false;
          onDash?.(false);
        }
      }

      const airControlFactor = isGrounded ? 1 : 0.5;

      const newVelocity = new THREE.Vector3(
        direction.current.x * finalSpeed * airControlFactor,
        velocity.current.y,
        direction.current.z * finalSpeed * airControlFactor,
      );

      api.velocity.set(newVelocity.x, newVelocity.y, newVelocity.z);

      if (keysPressed.current[" "] && isGrounded) {
        api.velocity.set(newVelocity.x, jumpForce, newVelocity.z);
      }

      if (dashCooldownTimer.current > 0) {
        dashCooldownTimer.current -= delta;
      }

      // 🎯 Collision MovingWalls
      if (movingWallsRef?.current) {
        if (
          checkCollisionWithWalls(
            movingWallsRef.current.wallsRefs,
            [5, 12, -40],
          )
        ) {
          return;
        }
      }

      // 🎯 Collision ClosingWalls
      if (closingWallsRef?.current) {
        if (
          checkCollisionWithWalls(
            closingWallsRef.current.wallsRefs,
            [4.5, 18, -75],
          )
        ) {
          return;
        }
      }

      if (velocity.current.y < -7.5 && positionRef.current[1] < 5) {
        setIsRespawning(true);
        api.velocity.set(0, 0, 0);
        api.angularVelocity.set(0, 0, 0);
        api.position.set(4.6, 18, -92); // Position de respawn sur la première plateforme

        setTimeout(() => {
          setIsRespawning(false);
        }, 1000);
      }
    });

    return (
      <mesh ref={playerRef} castShadow receiveShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>
    );
  },
);

Player.displayName = "Player";
export default Player;
