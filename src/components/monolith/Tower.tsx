import { useMemo } from 'react'
import * as THREE from 'three'

interface Chunk {
  position: [number, number, number]
  rotation: [number, number, number]
  radius: number
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
      })
      y += step * 0.25
    }
    return { chunks, topY: y }
  }, [count])
}

export default function Tower({ count = 8 }: { count?: number }) {
  const { chunks } = useTowerChunks(count)

  // One shared material instance for every chunk — flat-shaded for the
  // faceted low-poly look, low roughness so it catches the rim light.
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#c8c8ca',
        flatShading: true,
        roughness: 0.35,
        metalness: 0.1,
      }),
    [],
  )

  return (
    <group>
      {chunks.map((chunk, i) => (
        <mesh key={i} position={chunk.position} rotation={chunk.rotation} material={material}>
          <icosahedronGeometry args={[chunk.radius, 0]} />
        </mesh>
      ))}
    </group>
  )
}
