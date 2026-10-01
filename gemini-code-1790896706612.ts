import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function StarMesh() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 2;
    ref.current.rotation.x += delta * 0.7;
  });

  return (
    <Float speed={3} rotationIntensity={1.5}>
      <mesh ref={ref}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#39FF88" emissive="#39FF88" emissiveIntensity={1.5} wireframe />
      </mesh>
    </Float>
  );
}

export const GreenStar3D: React.FC = () => (
  <div className="w-8 h-8 inline-block align-middle ml-2">
    <Canvas camera={{ position: [0, 0, 3] }}>
      <ambientLight intensity={1.5} />
      <pointLight position={[5, 5, 5]} color="#52FF9A" intensity={2} />
      <StarMesh />
      <Sparkles count={12} scale={2} size={3} color="#39FF88" />
    </Canvas>
  </div>
);