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
import { useGLTF } from "@react-three/drei";
import { useWallCheck } from "@/hooks/useWallCheck";
import { MovingWallsHandle } from "./environements/obstacles/MovingWallObstacle";
import { ClosingWallsHandle } from "./environements/obstacles/ClosingWallTunnel";

const CHARACTERE_URL = "/3Dmodels/carac2.gltf";

const BASE_MOVE_SPEED = 15;
const BASE_JUMP_FORCE = 15;
const BOOST_MULTIPLIER_SPEED = 1.5;
const BOOST_MULTIPLIER_JUMP = 2.3;
const DASH_MULTIPLIER = 3;
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
    const { scene } = useGLTF(CHARACTERE_URL);
    const groupRef = useRef<THREE.Group>(null); // Groupe de rendu visuel

    const [playerRef, api] = useSphere(() => ({
      mass: 1,
      position: [0, 1, 0],
      args: [0.1], // plus petit collider = plus précis
      fixedRotation: true,
      linearDamping: 0.98,
    }));

    const { checkWall } = useWallCheck();
    const keysPressed = useRef<{ [key: string]: boolean }>({});
    const direction = useRef(new THREE.Vector3());
    const velocity = useRef(new THREE.Vector3());
    const positionRef = useRef<[number, number, number]>([0, 0, 0]);

    const isDashing = useRef(false);
    const dashTimer = useRef(0);
    const dashCooldownTimer = useRef(0);
    const [isRespawning, setIsRespawning] = useState(false);
    const [isGrounded, setIsGrounded] = useState(false);

    // 🌟 Centrage du modèle + remontée des pieds au sol
    useEffect(() => {
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      const bbox = new THREE.Box3().setFromObject(scene);
      const center = bbox.getCenter(new THREE.Vector3());
      const size = bbox.getSize(new THREE.Vector3());
      scene.position.sub(center);
      scene.position.y += size.y / 2; // pieds alignés
    }, [scene]);

    useImperativeHandle(ref, () => ({
      api,
      positionRef,
    }));

    useEffect(() => {
      const unsubVel = api.velocity.subscribe((v) => {
        velocity.current.set(...v);
        setIsGrounded(Math.abs(v[1]) < 0.05);
      });
      const unsubPos = api.position.subscribe((v) => {
        positionRef.current = v;
      });
      return () => {
        unsubVel();
        unsubPos();
      };
    }, [api]);

    useEffect(() => {
      const onKeyDown = (e: KeyboardEvent) => {
        keysPressed.current[e.key.toLowerCase()] = true;
      };
      const onKeyUp = (e: KeyboardEvent) => {
        keysPressed.current[e.key.toLowerCase()] = false;
      };
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);
      return () => {
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
      };
    }, []);

    const respawn = (position: [number, number, number]) => {
      setIsRespawning(true);
      api.velocity.set(0, 0, 0);
      api.angularVelocity.set(0, 0, 0);
      api.position.set(...position);
      if (groupRef.current) {
        groupRef.current.position.set(...position);
      }
      setTimeout(() => setIsRespawning(false), 200);
    };

    const checkCollisionWithWalls = (
      wallsRefs: React.RefObject<THREE.Object3D>[],
      respawnPosition: [number, number, number],
    ) => {
      if (!playerRef.current) return false;
      const playerBox = new THREE.Box3().setFromObject(playerRef.current);
      const padding = 0.4; // Ajuste selon ton modèle
      playerBox.expandByScalar(padding);

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

      // Gestion des mouvements
      const boostSpeed = isBoosting ? BOOST_MULTIPLIER_SPEED : 1;
      const boostJump = isBoosting ? BOOST_MULTIPLIER_JUMP : 1;
      const moveSpeed =
        BASE_MOVE_SPEED *
        boostSpeed *
        Math.max(0.5, 1 - (addictionLevel ?? 0) * 0.05);
      const jumpForce =
        BASE_JUMP_FORCE *
        boostJump *
        Math.max(0.5, 1 - (addictionLevel ?? 0) * 0.05);

      direction.current.set(0, 0, 0);
      if (keysPressed.current["z"]) direction.current.z -= 1;
      if (keysPressed.current["s"]) direction.current.z += 1;
      if (keysPressed.current["q"]) direction.current.x -= 1;
      if (keysPressed.current["d"]) direction.current.x += 1;
      direction.current.normalize();

      const posVec = new THREE.Vector3(...positionRef.current);
      if (checkWall(posVec, direction.current)) direction.current.set(0, 0, 0);

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

      let speed = moveSpeed;
      if (isDashing.current) {
        dashTimer.current -= delta;
        if (dashTimer.current > 0) {
          speed *= DASH_MULTIPLIER;
        } else {
          isDashing.current = false;
          onDash?.(false);
        }
      }

      const airFactor = isGrounded ? 1 : 0.5;
      const newVel = new THREE.Vector3(
        direction.current.x * speed * airFactor,
        velocity.current.y,
        direction.current.z * speed * airFactor,
      );
      api.velocity.set(newVel.x, newVel.y, newVel.z);

      if (keysPressed.current[" "] && isGrounded) {
        api.velocity.set(newVel.x, jumpForce, newVel.z);
      }

      dashCooldownTimer.current -= delta;

      if (movingWallsRef?.current) {
        checkCollisionWithWalls(movingWallsRef.current.wallsRefs, [5, 12, -40]);
      }
      if (closingWallsRef?.current) {
        checkCollisionWithWalls(
          closingWallsRef.current.wallsRefs,
          [4.5, 18, -75],
        );
      }

      if (velocity.current.y < -7.5 && positionRef.current[1] < 5) {
        respawn([4.6, 18, -92]);
      }

      // 📦 Mise à jour visuelle
      if (groupRef.current) {
        groupRef.current.position.set(
          positionRef.current[0],
          positionRef.current[1],
          positionRef.current[2],
        );
      }

      if (groupRef.current && direction.current.lengthSq() > 0.01) {
        const angle = Math.atan2(direction.current.x, direction.current.z); // direction en Y
        groupRef.current.rotation.y = angle - Math.PI / 2;
      }
    });

    return (
      <>
        {/* Collider invisible */}
        <mesh ref={playerRef} visible={false}>
          <sphereGeometry args={[0.1]} />
          <meshStandardMaterial />
        </mesh>

        {/* Affichage visuel dans un group synchronisé */}
        <group ref={groupRef}>
          <primitive object={scene} scale={0.2} />
        </group>
      </>
    );
  },
);

Player.displayName = "Player";
export default Player;
