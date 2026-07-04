import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

// Ashima/Stefan Gustavson simplex noise (MIT/public-domain, the standard
// compact 3D snippet used throughout the three.js ecosystem for cheap
// per-vertex noise).
const simplexNoise3D = /* glsl */ `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }
`

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPhase;
  uniform float uNoiseFreq;
  uniform float uNoiseAmp;

  varying vec3 vWorldPos;

  ${simplexNoise3D}

  void main() {
    // Two cheap octaves — slow, heavy, "geological" breathing, not jelly.
    float t = uTime * 0.12 + uPhase;
    float n = snoise(position * uNoiseFreq + t);
    n += 0.5 * snoise(position * uNoiseFreq * 2.1 + t * 1.3);

    vec3 displaced = position + normal * n * uNoiseAmp;

    vec4 worldPosition = modelMatrix * vec4(displaced, 1.0);
    vWorldPos = worldPosition.xyz;

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uRimColor;
  uniform float uRimIntensity;
  uniform float uRimPower;
  uniform vec3 uLightDir;
  uniform vec3 uLightColor;
  uniform vec3 uCameraPos;

  varying vec3 vWorldPos;

  void main() {
    // Derivative-based face normal (not the interpolated vertex normal) —
    // this is what keeps the low-poly faceted look under a custom shader,
    // matching the old material's flatShading.
    vec3 N = normalize(cross(dFdx(vWorldPos), dFdy(vWorldPos)));
    vec3 V = normalize(uCameraPos - vWorldPos);
    vec3 L = normalize(uLightDir);

    float diffuse = max(dot(N, L), 0.0);
    vec3 ambient = uColor * 0.22;
    vec3 lit = ambient + uColor * diffuse * uLightColor * 0.6;

    // Cheap Blinn-Phong specular for a bit of crystal-like catch-light —
    // tight and bright so it reads as a highlight, not a general glow.
    vec3 H = normalize(L + V);
    float spec = pow(max(dot(N, H), 0.0), 80.0);
    lit += spec * uLightColor * 1.4;

    float fresnel = pow(1.0 - max(dot(N, V), 0.0), uRimPower);
    vec3 color = lit + fresnel * uRimIntensity * uRimColor;

    gl_FragColor = vec4(color, 1.0);
  }
`

const RockMaterial = shaderMaterial(
  {
    uTime: 0,
    uPhase: 0,
    uNoiseFreq: 0.6,
    uNoiseAmp: 0.045,
    uColor: new THREE.Color('#c8c8ca'),
    uRimColor: new THREE.Color('#bfe9ff'),
    uRimIntensity: 2.6,
    uRimPower: 2.2,
    uLightDir: new THREE.Vector3(3, 10, -6),
    uLightColor: new THREE.Color('#dfe7ff'),
    uCameraPos: new THREE.Vector3(0, 0, 0),
  },
  vertexShader,
  fragmentShader,
)

extend({ RockMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    rockMaterial: Record<string, unknown>
  }
}

export default RockMaterial
