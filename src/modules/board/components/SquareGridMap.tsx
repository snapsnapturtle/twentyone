import React from 'react';
import { useUpdate } from 'react-three-fiber';
import { BufferGeometry, Vector3 } from 'three';

interface SquareGridMapProps {
    width: number;
    height: number;
    color: string;
    backgroundColor: string;
}

export function SquareGridMap({ width, height, color, backgroundColor }: SquareGridMapProps) {
    const halfHeight = Math.ceil(height / 2) - .5;
    const halfWidth = Math.ceil(width / 2) - .5;

    const points: Vector3[] = [];

    for (let i = -halfHeight; i <= halfHeight; i++) {
        points.push(new Vector3(-halfWidth, i, 0));
        points.push(new Vector3(halfWidth, i, 0));
    }

    for (let i = -halfWidth; i <= halfWidth; i++) {
        points.push(new Vector3(i, -halfHeight, 0));
        points.push(new Vector3(i, halfHeight, 0));
    }

    const geometryRef = useUpdate<BufferGeometry>(geometry => {
        geometry.setFromPoints(points);
    }, []);

    return (
        <>
            <mesh position={[ 0, 0, -1 ]}>
                <planeBufferGeometry args={[ width, height, 1, 1 ]} />
                <meshStandardMaterial color={backgroundColor} />
            </mesh>
            <lineSegments position={[ 0, 0, -1 ]}>
                <bufferGeometry attach="geometry" ref={geometryRef} />
                <meshBasicMaterial color={color} />
            </lineSegments>
        </>
    );
}
