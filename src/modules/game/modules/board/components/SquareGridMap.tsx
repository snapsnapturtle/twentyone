import React from 'react';
import { useUpdate } from 'react-three-fiber';
import { BufferGeometry, Color, Vector3 } from 'three';
import { useActiveBoard } from '../../../hooks/useActiveBoard';

export function SquareGridMap() {
    const { width, height, gridLineColor } = useActiveBoard();

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
    }, [ points ]);

    return (
        <lineSegments position={[ 0, 0, -1 ]}>
            <bufferGeometry attach="geometry" ref={geometryRef} />
            <meshBasicMaterial color={new Color(gridLineColor)} attach="material" />
        </lineSegments>
    );
}
