import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export default function ItemObject({ item, position, inKnapsack = false }) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!ref.current) return;

    if (hovered) {
      ref.current.rotation.y += 0.02;
      ref.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
    } else {
      ref.current.rotation.y += 0.005;
      ref.current.position.y = position[1];
    }
  });

  const getGeometry = () => {
    switch (item.shape) {
      case 'sphere':
        return <sphereGeometry args={[0.6, 32, 32]} />;
      case 'cylinder':
        return <cylinderGeometry args={[0.5, 0.5, 1.2, 32]} />;
      case 'cone':
        return <coneGeometry args={[0.6, 1.2, 32]} />;
      case 'torus':
        return <torusGeometry args={[0.5, 0.2, 16, 32]} />;
      default: // cube
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <group position={position}>
      <mesh
        ref={ref}
        castShadow
        receiveShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        {getGeometry()}
        <meshStandardMaterial
          color={item.color}
          metalness={0.5}
          roughness={0.5}
          emissive={hovered ? item.color : '#000000'}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>

      <Text
        position={[0, -0.8, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        W: {item.weight} | V: {item.value}
      </Text>

      <Text
        position={[0, -1.2, 0]}
        fontSize={0.25}
        color={inKnapsack ? '#4ade80' : '#f87171'}
        anchorX="center"
        anchorY="middle"
      >
        {inKnapsack ? 'In Knapsack' : 'Not Selected'}
      </Text>
    </group>
  );
}
