import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function ItemObject({ item, position, inKnapsack = false }) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);

  const getGeometry = () => {
    const ratio = item.value / item.weight;

    if (ratio > 3) return <octahedronGeometry args={[0.7, 0]} />;
    if (ratio > 1.5) return <dodecahedronGeometry args={[0.7]} />;
    return <boxGeometry args={[1, 1, 1]} />;
  };

  useFrame((state) => {
    if (!ref.current) return;

    if (hovered) {
      ref.current.rotation.y += 0.02;
      ref.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 2) * 0.2;
    } else if (!inKnapsack) {
      ref.current.rotation.y += 0.005;
      ref.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.5 + item.id) * 0.1;
    } else {
      ref.current.rotation.y += 0.002;
    }
  });

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

        {inKnapsack ? (
          <MeshDistortMaterial
            color={item.color}
            speed={0.5}
            distort={0.2}
            metalness={0.8}
            roughness={0.2}
            emissive={item.color}
            emissiveIntensity={0.3}
          />
        ) : (
          <meshPhysicalMaterial
            color={item.color}
            metalness={0.3}
            roughness={0.5}
            clearcoat={0.5}
            clearcoatRoughness={0.3}
          />
        )}
      </mesh>

      <Text
        position={[0, -0.8, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        depthOffset={1}
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {`W:${item.weight} V:${item.value}`}
      </Text>
    </group>
  );
}
