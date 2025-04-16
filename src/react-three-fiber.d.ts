import { ThreeElements } from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      
      group: ThreeElements['group'];
      mesh: ThreeElements['mesh'];
      primitive: any;
      object3D: ThreeElements['object3D'];
      
      
      directionalLight: ThreeElements['directionalLight'];
      spotLight: ThreeElements['spotLight'];
      pointLight: ThreeElements['pointLight'];
      ambientLight: ThreeElements['ambientLight'];
      
      
      instancedMesh: ThreeElements['instancedMesh'];
      
      
      boxGeometry: ThreeElements['boxGeometry'];
      sphereGeometry: ThreeElements['sphereGeometry'];
      planeGeometry: ThreeElements['planeGeometry'];
      torusGeometry: ThreeElements['torusGeometry'];
      
      
      meshStandardMaterial: ThreeElements['meshStandardMaterial'];
      meshPhysicalMaterial: ThreeElements['meshPhysicalMaterial'];
      meshBasicMaterial: ThreeElements['meshBasicMaterial'];
      shaderMaterial: ThreeElements['shaderMaterial'];
      
      
      nebulaMaterial: any;
    }
  }
} 