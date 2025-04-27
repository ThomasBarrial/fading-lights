"use client";

import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

type EffectsProps = {
  isDashing: boolean;
};

export default function Effects({ isDashing }: EffectsProps) {
  return (
    <EffectComposer>
      {/* Bloom constant */}
      <Bloom
        intensity={isDashing ? 1.5 : 0.5}
        luminanceThreshold={0}
        luminanceSmoothing={0.9}
        blendFunction={BlendFunction.ADD}
      />
      {/* Vignette qui s'intensifie */}
      <Vignette
        eskil={false}
        offset={0.3}
        darkness={isDashing ? 0.4 : 0.9}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}
