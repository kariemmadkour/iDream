import { useRef, useMemo } from 'react'
import { Canvas, useFrame, type ThreeElements } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float total = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      total += noise(p) * amp;
      p *= 2.02;
      amp *= 0.5;
    }
    return total;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

    vec2 mouseOffset = (uMouse - 0.5) * vec2(aspect, 1.0);
    float distToMouse = length(p - mouseOffset);

    float t = uTime * 0.06;
    vec2 flow = p * 1.6 + vec2(t, -t * 0.7);
    float n = fbm(flow + fbm(flow * 1.3 + t));

    float glow = smoothstep(0.9, 0.0, distToMouse) * 0.5;
    float field = n + glow;

    vec3 deep = vec3(0.01, 0.016, 0.03);
    vec3 cyan = vec3(0.024, 0.71, 0.83);
    vec3 sky = vec3(0.008, 0.518, 0.78);

    vec3 color = mix(deep, sky, smoothstep(0.2, 0.75, field));
    color = mix(color, cyan, smoothstep(0.55, 1.0, field) * 0.8);

    float vignette = smoothstep(1.1, 0.2, length(p));
    color *= mix(0.55, 1.0, vignette);

    float grain = (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.035;
    color += grain;

    gl_FragColor = vec4(color, 1.0);
  }
`

function FlowField() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const mouse = useRef(new THREE.Vector2(0.5, 0.5))

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    }),
    [],
  )

  useFrame((state, delta) => {
    if (!materialRef.current) return
    materialRef.current.uniforms.uTime.value += delta
    mouse.current.lerp(
      new THREE.Vector2((state.pointer.x + 1) / 2, (state.pointer.y + 1) / 2),
      0.05,
    )
    materialRef.current.uniforms.uMouse.value.copy(mouse.current)
    materialRef.current.uniforms.uResolution.value.set(state.size.width, state.size.height)
  })

  const props: ThreeElements['mesh'] = {}

  return (
    <mesh {...props}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

export default function HeroScene() {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 1], zoom: 1 }}
      dpr={[1, 1.75]}
      gl={{ antialias: false }}
      className="!absolute inset-0"
    >
      <FlowField />
    </Canvas>
  )
}
