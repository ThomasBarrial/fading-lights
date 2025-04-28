"use client";

import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

// 🔥 Le hook typé proprement
export function useSafeGLTF<T extends GLTF = GLTF>(url: string): T {
  return useGLTF(url) as unknown as T;
}
