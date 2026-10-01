import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';

function CharacterMesh({ name }: { name: string }) {
  const groupRef = useRef<THREE.Group>(null!);
  useFrame((_, delta) => {
    groupRef.current.rotation.y += delta * 0.8;
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} floatIntensity={0.8}>
        <mesh position={[0, 0.2, 0]}>
          <capsuleGeometry args={[0.6, 1.2, 8, 16]} />
          <meshStandardMaterial color="#0B3D24" roughness={0.3} metalness={0.8} emissive="#18C875" emissiveIntensity={0.4} />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color="#39FF88" emissive="#39FF88" emissiveIntensity={1.5} wireframe />
        </mesh>
      </Float>
    </group>
  );
}

export const CharacterCanvas: React.FC<{ characterName: string }> = ({ characterName }) => (
  <div className="w-full h-72 rounded-2xl bg-gradient-to-b from-[#E8FFF1]/60 to-[#B8FFD6]/20 border border-[#39FF88]/40 relative overflow-hidden">
    <Canvas camera={{ position: [0, 1, 4.5], fov: 45 }}>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-5, 2, -2]} color="#39FF88" intensity={2} />
      <CharacterMesh name={characterName} />
      <Sparkles count={35} scale={4} size={4} speed={0.6} color="#39FF88" />
      <OrbitControls enableZoom enablePan={false} autoRotate autoRotateSpeed={1.2} />
    </Canvas>
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#0B3D24]/80 text-[#39FF88] text-xs font-semibold backdrop-blur-md border border-[#39FF88]/30">
      3D CHARACTER: {characterName.toUpperCase()}
    </div>
  </div>
);