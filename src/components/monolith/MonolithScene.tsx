import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import Tower, { estimateTowerHeight } from './Tower'
import ReflectiveFloor from './ReflectiveFloor'
import FlyingSilhouettes from './FlyingSilhouettes'
import WorldTravel from './WorldTravel'
import useReducedMotion from './useReducedMotion'
import useScrollProgress from './useScrollProgress'

const CHUNK_COUNT = 8
const TOWER_HEIGHT = estimateTowerHeight(CHUNK_COUNT)

export default function MonolithScene({
  className = 'h-screen w-full',
  enableScrollTravel = true,
}: {
  className?: string
  enableScrollTravel?: boolean
}) {
  const reducedMotion = useReducedMotion()
  const scrollProgress = useScrollProgress()

  return (
    <div className={className}>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, TOWER_HEIGHT * 0.5, 28], fov: 45 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#050507']} />
        <fog attach="fog" args={['#050507', 14, 34]} />

        <ambientLight intensity={0.28} />
        <directionalLight position={[3, 10, -6]} intensity={1.3} color="#dfe7ff" />
        <pointLight position={[-4, 3, 4]} intensity={0.3} color="#8fb8ff" />
        <pointLight position={[0, TOWER_HEIGHT * 0.5, 14]} intensity={0.5} color="#ffffff" />

        <Suspense fallback={null}>
          <Stars radius={90} depth={40} count={1200} factor={2} saturation={0} fade speed={reducedMotion ? 0 : 0.4} />

          <WorldTravel progressRef={scrollProgress} enabled={enableScrollTravel && !reducedMotion}>
            <Tower count={CHUNK_COUNT} />
            <ReflectiveFloor />
            <FlyingSilhouettes count={12} towerHeight={TOWER_HEIGHT} frozen={reducedMotion} />
          </WorldTravel>
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.45}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 2.5}
          target={[0, TOWER_HEIGHT * 0.4, 0]}
          autoRotate={!reducedMotion}
          autoRotateSpeed={0.3}
        />

        <EffectComposer multisampling={0}>
          <Bloom
            luminanceThreshold={0.85}
            luminanceSmoothing={0.4}
            intensity={0.85}
            mipmapBlur
            radius={0.5}
          />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={[0.0006, 0.0006]}
            radialModulation={false}
            modulationOffset={0}
          />
          <Vignette eskil={false} offset={0.15} darkness={0.9} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
