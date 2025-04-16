import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  useHelper, 
  Environment,
  Stars
} from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  ChromaticAberration
} from '@react-three/postprocessing';
import { 
  Vector3, 
  PointLight, 
  PointLightHelper, 
  SpotLight,
  SpotLightHelper,
  Vector2,
  Mesh,
  Object3D,
  InstancedMesh,
  SphereGeometry,
  MeshBasicMaterial,
  Color
} from 'three';
import { Physics } from '@react-three/rapier';

import NebulaBackground from '../components/NebulaBackground';
import DimensionalPortal from '../components/DimensionalPortal';
import CrystallineItem from '../components/CrystallineItem';
import CosmicArchitecture from '../components/CosmicArchitecture';
import useKnapsackStore from '../store/knapsackStore';


function OptimizedStarField({ count = 5000, radius = 100 }) {
  const meshRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  
  
  const starGeometry = useMemo(() => new SphereGeometry(0.1, 8, 8), []);
  const starMaterial = useMemo(() => new MeshBasicMaterial({ color: 0xffffff }), []);
  
  
  useEffect(() => {
    if (meshRef.current) {
      for (let i = 0; i < count; i++) {
        
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        const distance = Math.pow(Math.random(), 0.5) * radius; 
        
        dummy.position.set(
          distance * Math.sin(phi) * Math.cos(theta),
          distance * Math.sin(phi) * Math.sin(theta),
          distance * Math.cos(phi)
        );
        
        
        const scale = 0.1 + Math.random() * 0.4;
        dummy.scale.set(scale, scale, scale);
        
        
        dummy.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );
        
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
      
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [count, radius, dummy]);
  
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const time = clock.getElapsedTime();
      
      (meshRef.current.material as MeshBasicMaterial).color.setRGB(
        0.9 + Math.sin(time * 0.5) * 0.1,
        0.9 + Math.sin(time * 0.5) * 0.1,
        1.0
      );
    }
  });
  
  return <instancedMesh ref={meshRef} args={[starGeometry, starMaterial, count]} />;
}


function SceneLighting() {
  const spotLightRef = useRef<SpotLight>(null);
  const pointLightRef = useRef<PointLight>(null);
  
  
  
  
  
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    
    if (pointLightRef.current) {
      pointLightRef.current.position.x = Math.sin(time * 0.3) * 8;
      pointLightRef.current.position.z = Math.cos(time * 0.3) * 8;
      
      
      pointLightRef.current.intensity = 2 + Math.sin(time) * 0.5;
    }
  });
  
  return (
    <>
      
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.6} 
        color="#ffffff" 
      />
      
      
      <spotLight
        ref={spotLightRef}
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={0.8}
        intensity={1.5}
        color="#6600ff"
        castShadow
        target-position={[0, 0, 0]}
      />
      
      
      <pointLight 
        ref={pointLightRef}
        position={[5, 3, 0]} 
        intensity={2} 
        color="#00ffff" 
        distance={15}
        decay={2}
      />
      
      
      <ambientLight intensity={0.2} color="#9370DB" />
    </>
  );
}


function CameraController() {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  
  useEffect(() => {
    if (controlsRef.current) {
      
      camera.position.set(0, 2, 15);
      camera.lookAt(0, 0, 0);
      
      
      controlsRef.current.update();
    }
  }, [camera]);
  
  return (
    <OrbitControls 
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      rotateSpeed={0.5}
      minDistance={5}
      maxDistance={30}
      maxPolarAngle={Math.PI / 1.5}
    />
  );
}

interface SceneContentProps {
  isHighQuality?: boolean;
}


function SceneContent({ isHighQuality = true }: SceneContentProps) {
  const { items, solution, capacity } = useKnapsackStore();
  
  
  useEffect(() => {
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile/i.test(navigator.userAgent);
    if (isMobile && isHighQuality) {
      
    }
  }, [isHighQuality]);
  
  
  const itemPositions = items.map((_, index) => {
    const itemCount = items.length;
    const angle = (index / itemCount) * Math.PI * 2;
    const radius = 6;
    
    return [
      Math.sin(angle) * radius, 
      0, 
      Math.cos(angle) * radius
    ] as [number, number, number];
  });
  
  
  const handleItemClick = (id: string) => {
    console.log(`Item clicked: ${id}`);
    
  };
  
  return (
    <>
      
      <OptimizedStarField count={isHighQuality ? 5000 : 2000} radius={100} />
      
      
      <Physics gravity={[0, -0.2, 0]}>
        
        <DimensionalPortal position={[0, 0, 0]} />
        
        
        {items.map((item, index) => (
          <CrystallineItem
            key={item.id}
            item={item}
            position={itemPositions[index]}
            onClick={() => handleItemClick(item.id)}
            isSelected={solution?.selectedItems.some(selected => selected.id === item.id) || false}
            index={index}
          />
        ))}
      </Physics>
      
      
      <SceneLighting />
      
      
      <Environment preset="night" />
    </>
  );
}

export default function KnapsackScene() {
  
  const [bloomQuality, setBloomQuality] = useState({
    intensity: 0.8,
    luminanceThreshold: 0.2,
    mipmapBlur: true
  });
  
  const [isHighQuality, setIsHighQuality] = useState(true);
  
  
  useEffect(() => {
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile/i.test(navigator.userAgent);
    
    setIsHighQuality(!isMobile);
    
    
    if (isMobile) {
      setBloomQuality({
        intensity: 0.6,
        luminanceThreshold: 0.3,
        mipmapBlur: false
      });
    }
  }, []);
  
  return (
    <Canvas shadows>
      
      <PerspectiveCamera makeDefault fov={50} position={[0, 2, 15]} />
      <CameraController />
      
      
      <SceneContent isHighQuality={isHighQuality} />
      
      
      <EffectComposer>
        
        <Bloom 
          luminanceThreshold={bloomQuality.luminanceThreshold} 
          luminanceSmoothing={0.9} 
          intensity={bloomQuality.intensity} 
          mipmapBlur={bloomQuality.mipmapBlur}
        />
        
        
        <ChromaticAberration 
          offset={new Vector2(0.002, 0.002)} 
          radialModulation={true} 
          modulationOffset={0.5}
        />
      </EffectComposer>
    </Canvas>
  );
} 