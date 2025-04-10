import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export default function Knapsack({ position, capacity, currentWeight, totalValue }) {
  const ref = useRef();
  const fillLevel = capacity > 0 ? Math.min(currentWeight / capacity, 1) : 0;

  const fillColor = new THREE.Color(
    fillLevel < 0.7 ? '#4ade80' :
      fillLevel < 0.9 ? '#fbbf24' :
        '#ef4444'
  );

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.07;
    ref.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.4) * 0.05;
  });

  return (
    <group position={position}>
      <group ref={ref}>
        <mesh receiveShadow castShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[2.5, 2.3, 5, 32, 1, true]} />
          <meshPhysicalMaterial
            color="#334155"
            side={THREE.DoubleSide}
            transparent
            opacity={0.9}
            roughness={0.7}
            clearcoat={1}
            clearcoatRoughness={0.2}
          />
        </mesh>

        <mesh receiveShadow position={[0, -2.5, 0]}>
          <cylinderGeometry args={[2.3, 2.3, 0.1, 32]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>

        <mesh position={[0, -2.5 + (fillLevel * 5) / 2, 0]}>
          <cylinderGeometry args={[2.2, 2.2, fillLevel * 5, 32]} />
          <meshStandardMaterial
            color={fillColor}
            transparent
            opacity={0.7}
            emissive={fillColor}
            emissiveIntensity={0.3}
          />
        </mesh>

        <Text
          position={[0, -3.2, 0]}
          fontSize={0.4}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {`${currentWeight}/${capacity} (${Math.round(fillLevel * 100)}%)`}
        </Text>

        {totalValue > 0 && (
          <Text
            position={[0, -3.8, 0]}
            fontSize={0.4}
            color="#4ade80"
            anchorX="center"
            anchorY="middle"
          >
            {`Value: ${totalValue}`}
          </Text>
        )}
      </group>
    </group>
  );
}
