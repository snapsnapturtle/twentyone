import React, { MutableRefObject, useRef } from 'react';
import { useFrame } from 'react-three-fiber';
import * as THREE from 'three';
import { useRelativeMousePosition } from '../hooks/useRelativeMousePosition';

export const Pointer = ({ position }: { position: MutableRefObject<[ x: number, y: number ]> }) => {
    const mesh = useRef<THREE.Mesh>();
    const relativeMousePosition = useRelativeMousePosition();

    useFrame(() => {
        const meshRef = mesh.current;

        if (meshRef && position) {
            const mousePosition = relativeMousePosition(position.current[ 0 ], position.current[ 1 ]);

            meshRef.position.set(mousePosition[ 0 ], mousePosition[ 1 ], 5);
        }
    });

    if (!position) {
        return null;
    }

    return (
        <mesh ref={mesh} position={[ 0, 0, 0 ]} scale={[ 0.2, 0.2, 0.2 ]}>
            <circleBufferGeometry args={[ 1, 360 ]} />
            <meshStandardMaterial color="red" />
        </mesh>
    );
};
