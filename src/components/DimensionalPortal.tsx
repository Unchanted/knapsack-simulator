import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import useKnapsackStore from '../store/knapsackStore';

interface DimensionalPortalProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

export default function DimensionalPortal({ 
  position = [0, 0, 0], 
  rotation = [0, 0, 0],
  scale = 1 
}: DimensionalPortalProps) {
  const cylinderRef = useRef<THREE.Group>(null);
  const { capacity, solution, items } = useKnapsackStore();
  
  const capacityUtilization = useMemo(() => {
    if (!solution) return 0;
    
    const totalWeight = solution.selectedItems.reduce((sum, item) => sum + item.weight, 0);
    return Math.min(totalWeight / capacity, 1);
  }, [solution, capacity]);
  
  useFrame(({ clock }) => {
    if (cylinderRef.current) {
      cylinderRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.3) * 0.05;
    }
  });
  
  const cylinderRadius = 2;
  const cylinderHeight = 4;
  
  return (
    <group position={position} rotation={rotation as any} scale={scale}>
      <group ref={cylinderRef}>
        <mesh>
          <cylinderGeometry args={[cylinderRadius, cylinderRadius, cylinderHeight, 32, 1, true]} />
          <meshStandardMaterial
            color="#4d00b9"
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        <mesh position={[0, -cylinderHeight/2 + 0.01, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[cylinderRadius, cylinderRadius * 0.5, 32, 1, true]} />
          <meshStandardMaterial
            color="#4d00b9"
            side={THREE.DoubleSide}
          />
        </mesh>
        
        <mesh position={[0, -cylinderHeight/2 - cylinderRadius * 0.5 + 0.01, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color="#4d00b9"
          />
        </mesh>
        
        <mesh position={[0, cylinderHeight/2 - 0.01, 0]}>
          <coneGeometry args={[cylinderRadius, cylinderRadius * 0.2, 32, 1, true]} />
          <meshStandardMaterial
            color="#4d00b9"
            side={THREE.DoubleSide}
          />
        </mesh>
        
        <mesh>
          <cylinderGeometry args={[cylinderRadius * 0.99, cylinderRadius * 0.99, cylinderHeight, 32, 1, true]} />
          <meshStandardMaterial
            color="#4d00b9"
            transparent
            opacity={0.3}
            side={THREE.BackSide}
          />
        </mesh>
        
        <mesh position={[0, cylinderHeight/2, 0]}>
          <torusGeometry args={[cylinderRadius, 0.1, 16, 32]} />
          <meshStandardMaterial
            color="#8d44ff"
            emissive="#8d44ff"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>
      
      <Billboard
        follow={true}
        position={[0, 3, 0]}
      >
        <Text3D
          size={0.25}
          height={0.05}
          curveSegments={8}
          bevelEnabled
          bevelThickness={0.01}
          bevelSize={0.01}
          font="/fonts/helvetiker_regular.typeface.json"
        >
          {`Capacity: ${Math.floor(capacityUtilization * 100)}% of ${capacity}`}
          <meshStandardMaterial 
            color="#00ffff"
          />
        </Text3D>
      </Billboard>
    </group>
  );
} 