import { ThreeElements } from '@react-three/fiber';
import { ReactElement } from 'react';

declare module '@react-spring/three' {
  export namespace animated {
    export const group: (props: ThreeElements['group']) => ReactElement;
    export const mesh: (props: ThreeElements['mesh']) => ReactElement;
    export const object3D: (props: ThreeElements['object3D']) => ReactElement;
  }
} 