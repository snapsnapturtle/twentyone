import React from 'react';
import { useUpdate } from 'react-three-fiber';
import { BufferGeometry, Color, Vector3 } from 'three';
import { useColors } from '../hooks/useColors';

interface SquareGridMapProps {
    width: number;
    height: number;
}

export function SquareGridMap({ width, height }: SquareGridMapProps) {
    const colors = useColors();
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
            <mesh position={[ 0, 0, -1 ]} receiveShadow={true}>
                <planeBufferGeometry args={[ width, height ]} />
                <meshStandardMaterial color={new Color(colors.backgroundPrimary)} />
            </mesh>
            <lineSegments position={[ 0, 0, -1 ]}>
                <bufferGeometry attach="geometry" ref={geometryRef} />
                <meshBasicMaterial color={new Color(colors.contentStateDisabled)} />
            </lineSegments>
        </>
    );
}
