import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, TorusKnot, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

function BioMesh({ type }: { type: string }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    meshRef.current.rotation.y += delta * 0.8;
  });

  if (type === 'dna') {
    return (
      <TorusKnot ref={meshRef} args={[0.8, 0.25, 128, 32]}>
        <meshStandardMaterial color="#39FF88" emissive="#18C875" wireframe roughness={0.1} />
      </TorusKnot>
    );
  }

  return (
    <Icosahedron ref={meshRef} args={[1, 2]}>
      <meshStandardMaterial color="#52FF9A" emissive="#0B3D24" roughness={0.3} wireframe />
    </Icosahedron>
  );
}

export const BiologyModel: React.FC<{ type: string }> = ({ type }) => (
  <div className="w-full h-40 rounded-xl bg-[#E8FFF1]/60 border border-[#39FF88]/40 my-2">
    <Canvas camera={{ position: [0, 0, 3] }}>
      <ambientLight intensity={1.2} />
      <pointLight position={[3, 3, 3]} color="#39FF88" intensity={2} />
      <Float speed={2} rotationIntensity={1}>
        <BioMesh type={type} />
      </Float>
      <OrbitControls enableZoom autoRotate autoRotateSpeed={1.5} />
    </Canvas>
  </div>
);