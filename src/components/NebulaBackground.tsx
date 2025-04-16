import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { shaderMaterial, Instance, Instances } from '@react-three/drei';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';

import { nebulaShader } from '../shaders/nebula';


const NebulaMaterial = shaderMaterial(
  {
    time: 0,
    resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
    qualityLevel: 1 
  },
  nebulaShader.vertexShader,
  nebulaShader.fragmentShader
);


extend({ NebulaMaterial });

interface NebulaBackgroundProps {
  qualityPreset?: 'high' | 'medium' | 'low' | 'auto';
  showStars?: boolean;
}

export default function NebulaBackground({ 
  qualityPreset = 'auto',
  showStars = true
}: NebulaBackgroundProps) {
  const materialRef = useRef<any>();
  const groupRef = useRef<THREE.Group>(null);
  
  
  const [devicePerformance, setDevicePerformance] = useState<'high' | 'medium' | 'low'>('medium');
  const [qualityLevel, setQualityLevel] = useState<number>(1); 
  const { gl, size } = useThree();
  
  
  useEffect(() => {
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile/i.test(navigator.userAgent);
    
    
    const isWebGL2 = gl.capabilities.isWebGL2;
    const maxTextureSize = gl.capabilities.maxTextureSize;
    
    let performance: 'high' | 'medium' | 'low' = 'medium';
    
    if (isMobile || !isWebGL2 || maxTextureSize < 4096) {
      performance = 'low';
    } else if (maxTextureSize >= 16384 && navigator.hardwareConcurrency > 4) {
      performance = 'high';
    } else {
      performance = 'medium';
    }
    
    setDevicePerformance(performance);
    
    
    if (qualityPreset === 'auto') {
      setQualityLevel(performance === 'high' ? 2 : performance === 'medium' ? 1 : 0);
    } else {
      setQualityLevel(qualityPreset === 'high' ? 2 : qualityPreset === 'medium' ? 1 : 0);
    }
    
    
    const handleResize = () => {
      if (materialRef.current) {
        materialRef.current.resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [gl, qualityPreset]);
  
  
  const geometries = useMemo(() => {
    
    const getSegments = () => {
      switch (qualityLevel) {
        case 2: return { outer: 128, inner: 64 };
        case 1: return { outer: 96, inner: 48 };
        case 0: return { outer: 64, inner: 32 };
        default: return { outer: 96, inner: 48 };
      }
    };
    
    const segments = getSegments();
    
    return {
      outer: new THREE.SphereGeometry(40, segments.outer, segments.outer),
      middle: qualityLevel > 0 ? new THREE.SphereGeometry(35, segments.inner, segments.inner) : null,
      inner: new THREE.SphereGeometry(30, segments.inner, segments.inner)
    };
  }, [qualityLevel]);
  
  
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.qualityLevel = qualityLevel;
    }
  }, [qualityLevel]);
  
  
  const frameSkip = useMemo(() => {
    return qualityLevel === 0 ? 2 : 1; 
  }, [qualityLevel]);
  
  
  const frameCount = useRef(0);
  
  
  useFrame(({ clock, camera }) => {
    
    frameCount.current += 1;
    if (frameCount.current % frameSkip !== 0) return;
    
    if (materialRef.current) {
      materialRef.current.time = clock.elapsedTime;
    }
    
    
    if (groupRef.current) {
      
      const isVisible = camera.position.length() < 100;
      
      if (isVisible) {
        
        const speed = qualityLevel === 0 ? 0.5 : qualityLevel === 1 ? 0.8 : 1.0;
        
        
        groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.03 * speed) * 0.02;
        groupRef.current.rotation.x = Math.cos(clock.elapsedTime * 0.05 * speed) * 0.01;
      }
    }
  });
  
  
  const starCount = useMemo(() => {
    if (!showStars) return 0;
    switch (qualityLevel) {
      case 2: return 5000;
      case 1: return 2000;
      case 0: return 500;
      default: return 2000;
    }
  }, [qualityLevel, showStars]);
  
  
  const starInstances = useMemo(() => {
    const instances = [];
    
    for (let i = 0; i < starCount; i++) {
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 80
      );
      const scale = Math.random() * 0.1 + 0.05;
      const rotation = [0, 0, Math.random() * Math.PI];
      instances.push({ position, scale, rotation });
    }
    
    return instances;
  }, [starCount]);
  
  return (
    <>
      <group ref={groupRef}>
        
        <mesh>
          <primitive object={geometries.outer} attach="geometry" />
          <nebulaMaterial ref={materialRef} transparent side={THREE.BackSide} />
        </mesh>
        
        
        {geometries.middle && (
          <mesh rotation={[Math.PI * 0.2, Math.PI * 0.25, 0]}>
            <primitive object={geometries.middle} attach="geometry" />
            <nebulaMaterial transparent side={THREE.BackSide} />
          </mesh>
        )}
        
        
        <mesh rotation={[Math.PI * -0.1, Math.PI * -0.15, 0]}>
          <primitive object={geometries.inner} attach="geometry" />
          <nebulaMaterial transparent side={THREE.BackSide} />
        </mesh>
        
        
        {showStars && starCount > 0 && (
          <Instances limit={starCount}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial 
              color="#ffffff" 
              transparent 
              opacity={0.8} 
              side={THREE.DoubleSide} 
            />
            
            {starInstances.map((props, i) => (
              <Instance 
                key={i} 
                position={props.position} 
                scale={props.scale} 
                rotation={props.rotation as [number, number, number]} 
              />
            ))}
          </Instances>
        )}
      </group>
    </>
  );
} 