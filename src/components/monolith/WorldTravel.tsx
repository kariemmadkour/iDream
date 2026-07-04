import { useMemo, useRef, type MutableRefObject, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Phase 3 (scroll travel): rather than fighting OrbitControls for ownership
// of the camera, we move the *world* along a spline as the page scrolls —
// the tower recedes/shifts the way it would if the camera were flying past
// it, while OrbitControls keeps full control of drag-to-orbit the whole time.
export default function WorldTravel({
  progressRef,
  enabled,
  children,
}: {
  progressRef: MutableRefObject<number>
  enabled: boolean
  children: ReactNode
}) {
  const groupRef = useRef<THREE.Group>(null)
  const eased = useRef(0)

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0.6, -0.6, -3),
        new THREE.Vector3(-0.4, -1.4, -7.5),
        new THREE.Vector3(0.3, -1.8, -13),
      ]),
    [],
  )

  useFrame(() => {
    if (!groupRef.current) return
    const target = enabled ? progressRef.current : 0
    eased.current += (target - eased.current) * 0.06
    const point = curve.getPoint(eased.current)
    groupRef.current.position.copy(point)
  })

  return <group ref={groupRef}>{children}</group>
}
