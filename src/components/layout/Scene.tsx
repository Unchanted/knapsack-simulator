import { Environment } from '@react-three/drei'

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#8a2be2" />
      </mesh>

      <Environment preset="city" />
    </>
  )
}

export default Scene
