import { Canvas } from '@react-three/fiber';
import { OrbitControls, PresentationControls, Environment } from '@react-three/drei';
import { useState, useEffect } from 'react';
import useKnapsackStore from '../../store/knapsackStore';
import ItemObject from './ItemObject';
import Knapsack from './Knapsack';

export default function KnapsackScene() {
  const { items, solution, capacity } = useKnapsackStore();
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
    <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
      <color attach="background" args={['#050816']} />
      <fog attach="fog" args={['#050816', 10, 40]} />

      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />

      <PresentationControls
        global
        rotation={[0.1, 0, 0]}
        polar={[-Math.PI / 4, Math.PI / 4]}
        azimuth={[-Math.PI / 4, Math.PI / 4]}
      >
        <Knapsack
          position={[0, 0, 0]}
          capacity={capacity}
          items={inKnapsack}
          totalWeight={inKnapsack.reduce((sum, item) => sum + item.weight, 0)}
          totalValue={inKnapsack.reduce((sum, item) => sum + item.value, 0)}
        />

        {inKnapsack.map((item, index) => (
          <ItemObject
            key={item.id}
            item={item}
            position={[
              -1.5 + (index % 3) * 1.5,
              1.5 + Math.floor(index / 3) * 1.5,
              0
            ]}
            inKnapsack={true}
          />
        ))}

        {outsideKnapsack.map((item, index) => (
          <ItemObject
            key={item.id}
            item={item}
            position={[
              4 + (index % 2) * 2,
              1 + Math.floor(index / 2) * 2,
              0
            ]}
            inKnapsack={false}
          />
        ))}
      </PresentationControls>

      <Environment preset="city" />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
