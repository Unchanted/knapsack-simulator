import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html, useGLTF, Billboard } from '@react-three/drei';
import { useSpring, animated, config } from '@react-spring/three';
import * as THREE from 'three';
import { Item } from '../algorithms/knapsack';


const CRYSTAL_SHAPES = [
  'octahedron',
  'dodecahedron',
  'icosahedron'
];


const getItemSize = (weight: number, maxWeight = 50) => {
  const normalizedWeight = Math.min(weight / maxWeight, 1);
  return 0.3 + normalizedWeight * 0.7; 
};


const getItemComplexity = (value: number, maxValue = 100) => {
  const normalizedValue = Math.min(value / maxValue, 1);
  return Math.floor(normalizedValue * 3); 
};

interface CrystallineItemProps {
  item: Item;
  position?: [number, number, number];
  onClick?: () => void;
  isSelected?: boolean;
  index: number;
}

export default function CrystallineItem({ 
  item,
  position = [0, 0, 0],
  onClick,
  isSelected = false,
  index
}: CrystallineItemProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const displayRef = useRef<THREE.Group>(null);
  
  const [hovered, setHovered] = useState(false);
  const [appeared, setAppeared] = useState(false);
  
  
  const size = getItemSize(item.weight);
  const shapeIndex = getItemComplexity(item.value);
  
  
  const efficiency = item.value / item.weight;
  const normalizedEfficiency = Math.min(efficiency / 10, 1); 
  
  
  const itemColor = new THREE.Color().setHSL(
    0.75 - normalizedEfficiency * 0.5, 
    0.7, 
    0.5 + normalizedEfficiency * 0.3  
  );
  
  
  const { scale, emissiveIntensity, hoverElevation } = useSpring({
    from: { scale: 0.01, emissiveIntensity: 0, hoverElevation: 0 },
    scale: appeared ? (hovered ? size * 1.2 : size) : 0.01,
    emissiveIntensity: isSelected ? 0.6 : (hovered ? 0.3 : 0),
    hoverElevation: hovered ? 0.3 : 0,
    config: { mass: 1, tension: 170, friction: 26 }
  });
  
  
  const { targetX, targetY, targetZ } = useSpring({
    targetX: isSelected ? 0 : position[0],
    targetY: isSelected ? -1 : position[1],
    targetZ: isSelected ? 0 : position[2],
    config: { mass: 1, tension: 80, friction: 20 }
  });
  
  
  useEffect(() => {
    
    const timeout = setTimeout(() => {
      setAppeared(true);
    }, 100 * index); 
    
    return () => clearTimeout(timeout);
  }, [index]);
  
  
  const handlePointerOver = () => setHovered(true);
  const handlePointerOut = () => setHovered(false);
  const handleClick = () => onClick && onClick();
  
  
  useFrame(({ clock }) => {
    if (meshRef.current && !isSelected) {
      
      const time = clock.getElapsedTime();
      meshRef.current.position.y = position[1] + Math.sin(time * 0.7 + index) * 0.1;
    }
    
    if (displayRef.current) {
      
      displayRef.current.rotation.y += 0.005;
    }
  });
  
  return (
    <animated.group>
      <animated.mesh
        ref={meshRef}
        position={[
          targetX.get(),
          targetY.get(),
          targetZ.get()
        ]}
        scale={scale}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        
        {shapeIndex === 0 && <boxGeometry args={[1, 1, 1]} />}
        {shapeIndex === 1 && <sphereGeometry args={[0.7, 16, 16]} />}
        {shapeIndex === 2 && <coneGeometry args={[0.7, 1.4, 16]} />}
        
        <animated.meshStandardMaterial
          color={itemColor}
          roughness={0.3}
          metalness={0.7}
          emissive={itemColor}
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={0.9}
        />
      </animated.mesh>
      
      
      <Billboard
        follow={true}
        position={[
          isSelected ? 0 : position[0], 
          isSelected ? 1 : position[1] + 1.5, 
          isSelected ? 0 : position[2]
        ]}
      >
        <animated.group
          ref={displayRef}
          visible={hovered || isSelected}
        >
          <Text
            position={[0, 0.2, 0]}
            fontSize={0.2}
            color="#00ffff"
            anchorX="center"
            anchorY="middle"
          >
            {`Value: ${item.value}`}
          </Text>
          
          <Text
            position={[0, 0, 0]}
            fontSize={0.2}
            color="#ff00ff"
            anchorX="center"
            anchorY="middle"
          >
            {`Weight: ${item.weight}`}
          </Text>
          
          <Text
            position={[0, -0.2, 0]}
            fontSize={0.2}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {`Ratio: ${(item.value / item.weight).toFixed(2)}`}
          </Text>
        </animated.group>
      </Billboard>
      
      
      {isSelected && (
        <mesh>
          <cylinderGeometry args={[0.02, 0.02, 8, 8]} />
          <meshBasicMaterial 
            color="#00ffff" 
            transparent 
            opacity={0.3} 
          />
        </mesh>
      )}
    </animated.group>
  );
} 