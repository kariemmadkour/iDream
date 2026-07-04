import { MeshReflectorMaterial } from '@react-three/drei'

export default function ReflectiveFloor({ radius = 6.5 }: { radius?: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <circleGeometry args={[radius, 64]} />
      <MeshReflectorMaterial
        blur={[400, 150]}
        resolution={512}
        mixBlur={9}
        mixStrength={1.6}
        roughness={0.9}
        depthScale={1}
        minDepthThreshold={0.85}
        maxDepthThreshold={1.2}
        color="#0a0a0d"
        metalness={0.4}
        mirror={0.55}
      />
    </mesh>
  )
}
