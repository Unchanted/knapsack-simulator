import { useMemo } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export default function DynamicProgrammingMatrix({ position, rotation, scale, solution, currentStateIndex }) {
  const currentState = solution.states[currentStateIndex];
  const dpTable = currentState.dpTable;
  const currentItem = currentState.currentItem;
  const currentCapacity = currentState.currentCapacity;

  const cellSize = 0.8;
  const padding = 0.05;
  const rows = dpTable.length;
  const cols = dpTable[0].length;

  const matrixCells = useMemo(() => {
    const cells = [];

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (i === 0 && j !== 0 && j !== cols - 1 && j !== currentCapacity) continue;
        if (j === 0 && i !== 0 && i !== rows - 1 && i !== currentItem + 1) continue;

        if (rows > 8 && cols > 8) {
          if (i > 2 && i < rows - 2 && j > 2 && j < cols - 2 &&
            i !== currentItem + 1 && j !== currentCapacity) {
            continue;
          }
        }

        let cellColor;
        if (i === currentItem + 1 && j === currentCapacity) {
          cellColor = "#f87171";
        } else if (i === rows - 1 && j === cols - 1) {
          cellColor = "#4ade80";
        } else if (i === currentItem + 1) {
          cellColor = "#93c5fd";
        } else if (j === currentCapacity) {
          cellColor = "#d8b4fe";
        } else {
          cellColor = "#1e293b";
        }

        const x = j * (cellSize + padding);
        const y = -(i * (cellSize + padding));

        cells.push(
          <group key={`${i}-${j}`} position={[x, y, 0]}>
            <mesh>
              <boxGeometry args={[cellSize, cellSize, 0.1]} />
              <meshStandardMaterial
                color={cellColor}
                metalness={0.1}
                roughness={0.8}
                emissive={cellColor}
                emissiveIntensity={0.2}
              />
            </mesh>
            <Text
              position={[0, 0, 0.06]}
              fontSize={0.4}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {dpTable[i][j]}
            </Text>
          </group>
        );
      }
    }

    return cells;
  }, [dpTable, currentItem, currentCapacity, rows, cols, cellSize, padding]);

  const rowHeaders = useMemo(() => {
    return Array(rows).fill().map((_, i) => (
      <Text
        key={`row-${i}`}
        position={[-cellSize - padding, -(i * (cellSize + padding)), 0]}
        fontSize={0.3}
        color={i === currentItem + 1 ? "#93c5fd" : "white"}
        anchorX="center"
        anchorY="middle"
      >
        {i === 0 ? "0" : `Item ${i}`}
      </Text>
    ));
  }, [rows, currentItem, cellSize, padding]);

  const colHeaders = useMemo(() => {
    return Array(cols).fill().map((_, j) => (
      <Text
        key={`col-${j}`}
        position={[j * (cellSize + padding), cellSize + padding, 0]}
        fontSize={0.3}
        color={j === currentCapacity ? "#d8b4fe" : "white"}
        anchorX="center"
        anchorY="middle"
      >
        {j}
      </Text>
    ));
  }, [cols, currentCapacity, cellSize, padding]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Text
        position={[(cols * (cellSize + padding)) / 2 - cellSize / 2, cellSize * 3, 0]}
        fontSize={1}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        DP Table
      </Text>
      {matrixCells}
      {rowHeaders}
      {colHeaders}
    </group>
  );
}
