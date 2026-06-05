import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface NeuralSphereProps {
  mousePosition: { x: number; y: number };
}

function NeuralSphereInner({ mousePosition }: NeuralSphereProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const sphereRef = useRef<THREE.Mesh>(null!);
  const innerSphereRef = useRef<THREE.Mesh>(null!);
  const particlesRef = useRef<THREE.Group>(null!);
  const starFieldRef = useRef<THREE.Points>(null!);



  // Particle data for orbiting
  const particleCount = 80;
  const particlesData = useMemo(() => {
    const data: Array<{
      angle: number;
      radius: number;
      speed: number;
      yOffset: number;
      size: number;
    }> = [];
    for (let i = 0; i < particleCount; i++) {
      data.push({
        angle: Math.random() * Math.PI * 2,
        radius: 2.8 + Math.random() * 1.4,
        speed: 0.3 + Math.random() * 0.8,
        yOffset: (Math.random() - 0.5) * 3.5,
        size: 0.04 + Math.random() * 0.06,
      });
    }
    return data;
  }, []);



  // Star field - static background stars
  const starCount = 1200;
  const starPositions = useMemo(() => {
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      // Spread stars in a large sphere around
      const radius = 35 + Math.random() * 25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Slight blue tint for some
      const brightness = 0.6 + Math.random() * 0.4;
      const isBlue = Math.random() > 0.7;
      colors[i3] = isBlue ? brightness * 0.8 : brightness;
      colors[i3 + 1] = isBlue ? brightness * 0.95 : brightness;
      colors[i3 + 2] = brightness;
    }
    return positions;
  }, []);

  const starColors = useMemo(() => {
    const colors = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const brightness = 0.6 + Math.random() * 0.4;
      const isBlue = Math.random() > 0.7;
      colors[i3] = isBlue ? brightness * 0.8 : brightness;
      colors[i3 + 1] = isBlue ? brightness * 0.95 : brightness;
      colors[i3 + 2] = brightness;
    }
    return colors;
  }, []);

  // Animate everything
  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Rotate main group based on mouse (smooth parallax)
    if (groupRef.current) {
      const targetRotX = mousePosition.y * 0.6;
      const targetRotY = mousePosition.x * 0.8;
      
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotX,
        0.04
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotY,
        0.04
      );
    }

    // Animate central sphere - subtle pulse and rotation
    if (sphereRef.current) {
      sphereRef.current.rotation.y = time * 0.12;
      const pulse = 1 + Math.sin(time * 1.8) * 0.015;
      sphereRef.current.scale.setScalar(pulse);
    }

    if (innerSphereRef.current) {
      innerSphereRef.current.rotation.y = time * -0.08;
      const pulse2 = 1 + Math.sin(time * 2.3) * 0.025;
      innerSphereRef.current.scale.setScalar(pulse2);
    }

    // Animate orbiting particles (trails effect)
    if (particlesRef.current) {
      particlesRef.current.children.forEach((particle, index) => {
        const data = particlesData[index];
        if (!data) return;

        const angle = time * data.speed + data.angle;
        const x = Math.cos(angle) * data.radius;
        const z = Math.sin(angle) * data.radius;
        const y = data.yOffset + Math.sin(time * 0.7 + index) * 0.3;

        particle.position.x = x;
        particle.position.y = y;
        particle.position.z = z;

        // Gentle scale pulse for "trail" feel
        const scale = data.size * (1 + Math.sin(time * 3 + index) * 0.3);
        particle.scale.setScalar(scale);
      });
    }

    // Slow rotation of starfield for depth
    if (starFieldRef.current) {
      starFieldRef.current.rotation.y = time * 0.008;
      starFieldRef.current.rotation.x = Math.sin(time * 0.003) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Neural Sphere - Volumetric Glass look */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[2.2]} />
        <meshPhongMaterial
          color="#56CCFF"
          emissive="#1a4a66"
          emissiveIntensity={0.4}
          shininess={90}
          wireframe={true}
          wireframeLinewidth={1.5}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Inner glowing core */}
      <mesh ref={innerSphereRef}>
        <sphereGeometry args={[1.65]} />
        <meshBasicMaterial
          color="#56CCFF"
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Additional shell for volumetric lighting */}
      <mesh>
        <sphereGeometry args={[2.65]} />
        <meshPhongMaterial
          color="#112233"
          transparent
          opacity={0.12}
          shininess={20}
          emissive="#224466"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Orbiting Neural Particles with "trails" */}
      <group ref={particlesRef}>
        {particlesData.map((data, i) => (
          <mesh key={i}>
            <sphereGeometry args={[data.size]} />
            <meshBasicMaterial color="#56CCFF" />
          </mesh>
        ))}
      </group>

      {/* Dynamic connection lines (simulated with thin cylinders or just points) */}
      {/* For performance, we use points for connections too but here simple lines via small spheres */}

      {/* Background Star Field */}
      <Points ref={starFieldRef} positions={starPositions} colors={starColors}>
        <PointMaterial
          transparent
          vertexColors
          size={0.065}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* Extra subtle point lights for cinematic feel */}
      <pointLight position={[-12, 8, -10]} color="#56CCFF" intensity={1.5} />
      <pointLight position={[12, -6, 14]} color="#a0d8ff" intensity={0.8} />
    </group>
  );
}

export default function NeuralSphere({ mousePosition }: NeuralSphereProps) {
  return (
    <div className="neural-sphere-container">
      <Canvas
        camera={{ position: [0, 0, 14], fov: 48 }}
        style={{ background: 'transparent' }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false,
        }}
        dpr={[1, 1.8]} // Cap for performance
      >
        <ambientLight intensity={0.15} />
        <NeuralSphereInner mousePosition={mousePosition} />
      </Canvas>
    </div>
  );
}
