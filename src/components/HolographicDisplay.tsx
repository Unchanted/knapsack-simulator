import React, { useRef } from 'react';
import { Text, Billboard } from '@react-three/drei';
import { useFrame, ThreeElements } from '@react-three/fiber';
import { Group } from 'three';
import { animated } from '@react-spring/three';


interface HolographicDisplayProps {
  text: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  fontSize?: number;
  maxWidth?: number;
  lineHeight?: number;
  letterSpacing?: number;
  textAlign?: "center" | "left" | "right" | "justify";
  font?: string;
  billboard?: boolean;
  animateY?: boolean;
  yAxisMovement?: number;
  yAxisSpeed?: number;
  animateRotation?: boolean;
  rotationSpeed?: number;
}

const HolographicDisplay: React.FC<HolographicDisplayProps> = ({
  text,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  color = "#00ff44",
  fontSize = 0.5,
  maxWidth = 2,
  lineHeight = 1,
  letterSpacing = 0,
  textAlign = "center",
  font = "/fonts/Inter-Regular.woff",
  billboard = true,
  animateY = true,
  yAxisMovement = 0.1,
  yAxisSpeed = 1,
  animateRotation = true,
  rotationSpeed = 0.5,
}) => {
  const groupRef = useRef<Group>(null);
  const initialY = position[1];

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    if (animateY) {
      groupRef.current.position.y = initialY + Math.sin(clock.getElapsedTime() * yAxisSpeed) * yAxisMovement;
    }

    if (animateRotation) {
      groupRef.current.rotation.y += rotationSpeed * 0.005;
    }
  });

  return (
    <animated.group 
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      {billboard ? (
        <Billboard position={[0, 0.75, 0]}>
          <Text
            color={color}
            fontSize={fontSize}
            maxWidth={maxWidth}
            lineHeight={lineHeight}
            letterSpacing={letterSpacing}
            textAlign={textAlign}
            font={font}
            anchorY="bottom"
            renderOrder={10}
          >
            {text}
          </Text>
        </Billboard>
      ) : (
        <Text
          color={color}
          fontSize={fontSize}
          maxWidth={maxWidth}
          lineHeight={lineHeight}
          letterSpacing={letterSpacing}
          textAlign={textAlign}
          font={font}
          position={[0, 0.75, 0]}
          anchorY="bottom"
          renderOrder={10}
        >
          {text}
        </Text>
      )}
    </animated.group>
  );
};

export default HolographicDisplay; 