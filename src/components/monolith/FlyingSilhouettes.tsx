import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Instance {
  radius: number
  baseHeight: number
  bobAmount: number
  bobSpeed: number
  speed: number
  phase: number
  tilt: number
}

export default function FlyingSilhouettes({
  count = 12,
  towerHeight = 8,
  frozen = false,
}: {
  count?: number
  towerHeight?: number
  frozen?: boolean
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  // A single reused Object3D to compose each instance's matrix per frame —
  // never allocated inside the render loop.
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const instances = useMemo<Instance[]>(
    () =>
      Array.from({ length: count }, () => ({
        radius: THREE.MathUtils.randFloat(3, 6.5),
        baseHeight: THREE.MathUtils.randFloat(towerHeight * 0.15, towerHeight * 0.95),
        bobAmount: THREE.MathUtils.randFloat(0.3, 1.1),
        bobSpeed: THREE.MathUtils.randFloat(0.3, 0.8),
        speed: THREE.MathUtils.randFloat(0.08, 0.22) * (Math.random() < 0.5 ? 1 : -1),
        phase: Math.random() * Math.PI * 2,
        tilt: THREE.MathUtils.randFloat(0.1, 0.3),
      })),
    [count, towerHeight],
  )

  const geometry = useMemo(() => new THREE.TetrahedronGeometry(0.22, 0), [])
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0c0c10',
        roughness: 0.95,
        metalness: 0,
        flatShading: true,
      }),
    [],
  )

  const applyPose = (t: number) => {
    const mesh = meshRef.current
    if (!mesh) return
    instances.forEach((inst, i) => {
      const angle = inst.phase + t * inst.speed
      const wobble = Math.sin(t * inst.bobSpeed * 1.7 + inst.phase) * 0.4
      const x = Math.cos(angle) * (inst.radius + wobble)
      const z = Math.sin(angle) * (inst.radius + wobble)
      const y = inst.baseHeight + Math.sin(t * inst.bobSpeed + inst.phase) * inst.bobAmount

      dummy.position.set(x, y, z)
      dummy.rotation.set(
        Math.sin(t * inst.bobSpeed + inst.phase) * inst.tilt,
        -angle + Math.PI / 2,
        Math.cos(t * inst.bobSpeed * 0.7 + inst.phase) * inst.tilt,
      )
      dummy.scale.set(1, 0.35, 2.3)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  }

  // If motion is frozen (prefers-reduced-motion), still pose everything once
  // on mount so instances don't sit stacked at the origin.
  useEffect(() => {
    if (frozen) applyPose(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frozen])

  useFrame(({ clock }) => {
    if (frozen) return
    applyPose(clock.getElapsedTime())
  })

  return <instancedMesh ref={meshRef} args={[geometry, material, count]} />
}
