import { Canvas } from '@react-three/fiber';
import { OrbitControls, PresentationControls, Environment, Text } from '@react-three/drei';
import { useState, useEffect } from 'react';
import useKnapsackStore from '../../store/knapsackStore';
import ItemObject from './ItemObject';
import Knapsack from './Knapsack';
import DynamicProgrammingMatrix from './DynamicProgrammingMatrix';

export default function KnapsackScene() {
  const { items, solution, capacity, currentStateIndex } = useKnapsackStore();
  const [inKnapsack, setInKnapsack] = useState([]);
  const [outsideKnapsack, setOutsideKnapsack] = useState([]);

  useEffect(() => {
    if (solution) {
      const selectedItems = solution.selectedItems.map(item => item.id);
      setInKnapsack(items.filter(item => selectedItems.includes(item.id)));
      setOutsideKnapsack(items.filter(item => !selectedItems.includes(item.id)));
    } else {
      setInKnapsack([]);
      setOutsideKnapsack(items);
    }
  }, [solution, items]);

  return (
    <Canvas shadows camera={{ position: [0, 5, 15], fov: 50 }} className="w-full h-full">
      <color attach="background" args={['#0f172a']} />
      <fog attach="fog" args={['#0f172a', 10, 40]} />

      <ambientLight intensity={0.4} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={1.5}
        castShadow
      />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      <Environment preset="city" />

      <PresentationControls
        global
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 4, Math.PI / 4]}
        azimuth={[-Math.PI / 4, Math.PI / 4]}
        config={{ mass: 2, tension: 400 }}
      >
        <group position={[0, 0, 0]}>
          <Knapsack
            position={[0, 0, 0]}
            capacity={capacity}
            currentWeight={inKnapsack.reduce((sum, item) => sum + item.weight, 0)}
            totalValue={inKnapsack.reduce((sum, item) => sum + item.value, 0)}
          />

          {inKnapsack.map((item, index) => {
            const col = index % 2;
            const row = Math.floor(index / 2);
            const position = [
              -1 + col * 2,
              0.5 + item.weight * 0.1 + row * 1.2,
              -0.5 + Math.random() * 1
            ];

            return (
              <ItemObject
                key={item.id}
                item={item}
                position={position}
                inKnapsack={true}
              />
            );
          })}

          {outsideKnapsack.map((item, index) => {
            const angle = (index / outsideKnapsack.length) * Math.PI * 1.5 - Math.PI * 0.75;
            const radius = 6;
            const position = [
              Math.cos(angle) * radius,
              1,
              Math.sin(angle) * radius
            ];

            return (
              <ItemObject
                key={item.id}
                item={item}
                position={position}
                inKnapsack={false}
              />
            );
          })}

          {solution && (
            <DynamicProgrammingMatrix
              position={[0, -3, -5]}
              rotation={[-Math.PI / 3, 0, 0]}
              solution={solution}
              currentStateIndex={currentStateIndex}
              scale={0.4}
            />
          )}

          {solution && (
            <Text
              position={[0, 6, 0]}
              fontSize={1.5}
              color="#4ade80"
              anchorX="center"
              anchorY="middle"
            >
              {`Max Value: ${solution.maxValue}`}
              <meshStandardMaterial
                color="#4ade80"
                toneMapped={false}
                emissive="#4ade80"
                emissiveIntensity={0.5}
              />
            </Text>
          )}
        </group>
      </PresentationControls>

      <OrbitControls
        enableZoom={true}
        enablePan={true}
        minDistance={5}
        maxDistance={30}
      />
    </Canvas>
  );
}
