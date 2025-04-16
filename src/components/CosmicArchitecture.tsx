import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Instances, Instance, Html } from '@react-three/drei';
import { useSpring, animated, config } from '@react-spring/three';
import * as THREE from 'three';
import useKnapsackStore from '../store/knapsackStore';

interface CosmicArchitectureProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}


interface CellProps {
  value: number;
  position: [number, number, number];
  isActive: boolean;
  isOptimal: boolean;
  opacity: number;
  row: number;
  col: number;
}

const Cell = ({ value, position, isActive, isOptimal, opacity, row, col }: CellProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  
  const { scale, emissiveIntensity, rotation } = useSpring({
    scale: isActive ? 1.3 : isOptimal ? 1.1 : 1,
    emissiveIntensity: isActive ? 0.8 : isOptimal ? 0.5 : 0.2,
    rotation: isActive ? Math.PI * 2 : 0,
    config: config.wobbly
  });
  
  
  const color = useMemo(() => {
    if (isActive) return '#00ffff';
    if (isOptimal) return '#ff00ff';
    return `hsl(270, 70%, ${40 + value * 5}%)`;
  }, [value, isActive, isOptimal]);
  
  
  useFrame(({ clock }) => {
    if (meshRef.current && !isActive) {
      meshRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.2 + position[0] * 0.5) * 0.1;
      meshRef.current.rotation.x = Math.cos(clock.elapsedTime * 0.2 + position[2] * 0.5) * 0.1;
    }
  });
  
  return (
    <group position={position}>
      <animated.mesh 
        ref={meshRef}
        scale={scale}
        rotation-y={rotation}
      >
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <animated.meshPhysicalMaterial
          color={color}
          metalness={0.7}
          roughness={0.2}
          transparent
          opacity={opacity}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          side={THREE.DoubleSide}
        />
      </animated.mesh>
      
      <Text
        position={[0, 0, 0.5]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        opacity={opacity}
        depthTest={false}
        renderOrder={2}
      >
        {value}
      </Text>
      
      
      {(row === 0 || col === 0) && (
        <Text
          position={[0, -0.6, 0]}
          fontSize={0.2}
          color="#aaffff"
          anchorX="center"
          anchorY="middle"
          opacity={0.8}
          renderOrder={2}
        >
          {row === 0 ? `W:${col}` : `I:${row}`}
        </Text>
      )}
    </group>
  );
};


interface ConnectionProps {
  start: [number, number, number];
  end: [number, number, number];
  isActive: boolean;
}

const Connection = ({ start, end, isActive }: ConnectionProps) => {
  const direction = new THREE.Vector3(
    end[0] - start[0],
    end[1] - start[1],
    end[2] - start[2]
  );
  const midpoint = new THREE.Vector3(
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2
  );
  const length = direction.length();
  
  
  const quaternion = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0);
  direction.normalize();
  quaternion.setFromUnitVectors(up, direction);
  
  
  const { pulseScale, opacity } = useSpring({
    pulseScale: isActive ? [1, 1.3, 1] : [1, 1, 1],
    opacity: isActive ? 0.8 : 0.2,
    config: {
      duration: 1000,
      loop: isActive
    }
  });
  
  return (
    <animated.mesh
      position={midpoint.toArray()}
      quaternion={quaternion as any}
      scale-y={length * 0.5}
    >
      <cylinderGeometry args={[0.02, 0.02, 1, 6]} />
      <animated.meshBasicMaterial
        color={isActive ? '#ff00ff' : '#4d3b78'}
        transparent
        opacity={opacity}
      />
    </animated.mesh>
  );
};


const TableLegend = () => {
  return (
    <group position={[0, 3, 0]}>
      <Text
        position={[0, 1, 0]}
        fontSize={0.6}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        renderOrder={2}
      >
        Dynamic Programming Table
      </Text>
      
      <group position={[-4, 0, 0]}>
        <mesh position={[0, 0, 0]} scale={0.3}>
          <boxGeometry args={[1, 1, 1]} />
          <meshPhysicalMaterial
            color="#00ffff"
            metalness={0.7}
            roughness={0.2}
            emissive="#00ffff"
            emissiveIntensity={0.5}
          />
        </mesh>
        <Text
          position={[1.5, 0, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
          renderOrder={2}
        >
          Current Cell
        </Text>
      </group>
      
      <group position={[1, 0, 0]}>
        <mesh position={[0, 0, 0]} scale={0.3}>
          <boxGeometry args={[1, 1, 1]} />
          <meshPhysicalMaterial
            color="#ff00ff"
            metalness={0.7}
            roughness={0.2}
            emissive="#ff00ff"
            emissiveIntensity={0.5}
          />
        </mesh>
        <Text
          position={[1.5, 0, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
          renderOrder={2}
        >
          Optimal Path
        </Text>
      </group>
      
      <Text
        position={[0, -1, 0]}
        fontSize={0.35}
        color="#aaffff"
        anchorX="center"
        anchorY="middle"
        renderOrder={2}
      >
        W = Weight Capacity, I = Item Index
      </Text>
    </group>
  );
};

export default function CosmicArchitecture({ 
  position = [0, 0, 0], 
  rotation = [0, 0, 0],
  scale = 1 
}: CosmicArchitectureProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  
  const { solution, currentStep, items } = useKnapsackStore();
  
  
  const { cells, connections, gridSize } = useMemo(() => {
    if (!solution) {
      return { cells: [], connections: [], gridSize: [0, 0] };
    }
    
    const { table, steps } = solution;
    const rows = table.length;
    const cols = table[0].length;
    
    
    const spacing = Math.max(15 / rows, 0.5);
    
    const cellsData: CellProps[] = [];
    const connectionsData: ConnectionProps[] = [];
    
    
    const activeStep = currentStep < steps.length ? steps[currentStep] : null;
    
    
    for (let i = 0; i < rows; i++) {
      for (let w = 0; w < cols; w++) {
        
        const x = (w - cols / 2) * spacing;
        const z = (i - rows / 2) * spacing;
        
        
        const isActive = activeStep && activeStep.i === i && activeStep.w === w;
        
        
        const isInOptimalPath = activeStep && 
          solution.selectedItems.some((_, idx) => {
            const row = rows - 1 - idx;
            return i === row && w === cols - 1;
          });
        
        
        cellsData.push({
          value: table[i][w],
          position: [x, 0, z],
          isActive,
          isOptimal: isInOptimalPath,
          opacity: table[i][w] > 0 || isActive || isInOptimalPath ? 0.8 : 0.3,
          row: i,
          col: w
        });
        
        
        if (i > 0 && w > 0) {
          
          connectionsData.push({
            start: [x, 0, z],
            end: [x, 0, z - spacing],
            isActive: isActive && activeStep?.prev?.i === i - 1 && activeStep?.prev?.w === w
          });
          
          
          if (table[i][w] !== table[i-1][w]) {
            const itemWeight = w - (activeStep?.prev?.w || 0);
            if (itemWeight > 0) {
              connectionsData.push({
                start: [x, 0, z],
                end: [x - itemWeight * spacing, 0, z - spacing],
                isActive: isActive && activeStep?.prev?.i === i - 1 && 
                  activeStep?.prev?.w === w - itemWeight
              });
            }
          }
        }
      }
    }
    
    return { 
      cells: cellsData, 
      connections: connectionsData, 
      gridSize: [rows, cols] 
    };
  }, [solution, currentStep]);
  
  
  const { tableOpacity, gridRotation } = useSpring({
    tableOpacity: solution ? 1 : 0,
    gridRotation: solution ? 0 : Math.PI * 2,
    config: config.molasses
  });
  
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      
      groupRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.2) * 0.5;
      
      
      groupRef.current.rotation.y = rotation[1] + Math.sin(clock.elapsedTime * 0.05) * 0.1;
    }
  });
  
  
  if (!solution) return null;
  
  
  const stepDescription = solution.steps[currentStep]?.description || "Initializing...";
  
  return (
    <animated.group 
      ref={groupRef}
      position={position}
      rotation={rotation as any}
      scale={scale}
      rotation-y={gridRotation}
      opacity={tableOpacity}
    >
      
      <TableLegend />
      
      
      <Text
        position={[0, -3, 0]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="top"
        maxWidth={10}
        textAlign="center"
        renderOrder={2}
      >
        {stepDescription}
      </Text>
      
      
      <group position={[0, 0, 0]}>
        
        {connections.map((connection, index) => (
          <Connection key={`conn-${index}`} {...connection} />
        ))}
        
        
        {cells.map((cell, index) => (
          <Cell key={`cell-${index}`} {...cell} />
        ))}
        
        
        <Text
          position={[gridSize[1] * 0.5, -2, gridSize[0] * -0.6]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          renderOrder={2}
        >
          Weight Capacity
        </Text>
        
        
        <Text
          position={[gridSize[1] * -0.6, -2, gridSize[0] * -0.2]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          rotation={[0, Math.PI/2, 0]}
          renderOrder={2}
        >
          Items
        </Text>
        
        
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
          <planeGeometry args={[gridSize[1] * 2, gridSize[0] * 2]} />
          <meshBasicMaterial 
            color="#15061e"
            transparent
            opacity={0.3}
            wireframe
          />
        </mesh>
      </group>
    </animated.group>
  );
} 