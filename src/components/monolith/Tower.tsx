import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import './RockMaterial'

interface RockMaterialImpl extends THREE.ShaderMaterial {
  uTime: number
  uCameraPos: THREE.Vector3
}

interface Chunk {
  position: [number, number, number]
  rotation: [number, number, number]
  radius: number
  phase: number
}

// The Y stacking is deterministic (only position jitter/rotation are
// randomized), so the overall height can be computed without building the
// whole chunk list — used by FlyingSilhouettes to size its orbit heights.
export function estimateTowerHeight(count: number): number {
  let y = 0
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1)
    const radius = THREE.MathUtils.lerp(1.5, 0.5, t)
    const step = radius * 1.35
    y += step + step * 0.25
  }
  return y
}

// Procedural cairn: irregular icosahedron chunks stacked with slight overlap,
// each offset/rotated a little from the one below and tapering toward the top.
function useTowerChunks(count: number): { chunks: Chunk[]; topY: number } {
  return useMemo(() => {
    const chunks: Chunk[] = []
    let y = 0
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1)
      const radius = THREE.MathUtils.lerp(1.5, 0.5, t)
      const step = radius * 1.35
      y += step
      const settle = 1 - t * 0.5 // chunks wander less as they near the top
      chunks.push({
        position: [
          (Math.random() - 0.5) * 0.7 * settle,
          y,
          (Math.random() - 0.5) * 0.7 * settle,
        ],
        rotation: [
          (Math.random() - 0.5) * 0.25,
          Math.random() * Math.PI * 2,
          (Math.random() - 0.5) * 0.25,
        ],
        radius,
        phase: Math.random() * Math.PI * 2,
      })
      y += step * 0.25
    }
    return { chunks, topY: y }
  }, [count])
}

export default function Tower({ count = 8 }: { count?: number }) {
  const { chunks } = useTowerChunks(count)
  const materialRefs = useRef<(RockMaterialImpl | null)[]>([])

  // A single frame loop drives every chunk's noise breathing + fresnel view
  // direction — cheap since it's just a couple of uniform writes per chunk.
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    for (const mat of materialRefs.current) {
      if (!mat) continue
      mat.uTime = t
      mat.uCameraPos.copy(state.camera.position)
    }
  })

  return (
    <group>
      {chunks.map((chunk, i) => (
        <mesh key={i} position={chunk.position} rotation={chunk.rotation}>
          <icosahedronGeometry args={[chunk.radius, 0]} />
          <rockMaterial
            ref={(el: RockMaterialImpl | null) => {
              materialRefs.current[i] = el
            }}
            uPhase={chunk.phase}
          />
        </mesh>
      ))}
    </group>
  )
}
