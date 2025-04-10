import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

export default function Knapsack({ position, capacity, items, totalWeight, totalValue }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
  });

  const fillLevel = capacity > 0 ? Math.min(totalWeight / capacity, 1) : 0;

  const efficiency = totalWeight > 0 ? totalValue / totalWeight : 0;

  const getColor = () => {
    if (fillLevel < 0.5) return '#4ade80';
    if (fillLevel < 0.9) return '#facc15';
    return '#f87171';
  };

  return (
    <group position={position}>
      <mesh
        receiveShadow
        position={[0, -2, 0]}
      >
        <boxGeometry args={[6, 0.2, 4]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      <group ref={ref}>
        <mesh position={[0, 0, -2]} receiveShadow>
          <boxGeometry args={[6, 4, 0.1]} />
          <meshStandardMaterial color="#475569" transparent opacity={0.9} />
        </mesh>

        <mesh position={[-3, 0, 0]} receiveShadow>
          <boxGeometry args={[0.1, 4, 4]} />
          <meshStandardMaterial color="#475569" transparent opacity={0.9} />
        </mesh>

        <mesh position={[3, 0, 0]} receiveShadow>
          <boxGeometry args={[0.1, 4, 4]} />
          <meshStandardMaterial color="#475569" transparent opacity={0.9} />
        </mesh>

        <mesh position={[0, 0, 2]} receiveShadow>
          <boxGeometry args={[6, 4, 0.1]} />
          <meshStandardMaterial color="#475569" transparent opacity={0.4} />
        </mesh>

        <mesh position={[0, -2 + (fillLevel * 4) / 2, 0]} receiveShadow>
          <boxGeometry args={[5.8, fillLevel * 4, 3.8]} />
          <meshStandardMaterial
            color={getColor()}
            transparent
            opacity={0.3}
            emissive={getColor()}
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>

      <Text
        position={[0, 2.5, 0]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Knapsack Capacity: {capacity}
      </Text>

      <Text
        position={[0, 2, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Current Weight: {totalWeight} / {capacity} ({Math.round(fillLevel * 100)}%)
      </Text>

      <Text
        position={[0, 1.5, 0]}
        fontSize={0.3}
        color="#4ade80"
        anchorX="center"
        anchorY="middle"
      >
        Total Value: {totalValue} (Efficiency: {efficiency.toFixed(2)})
      </Text>
    </group>
  );
}
