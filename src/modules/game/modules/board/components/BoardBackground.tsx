import React from 'react';
import { Color } from 'three';
import { useActiveBoard } from '../../../hooks/useActiveBoard';
import { useColors } from '../hooks/useColors';

export function BoardBackground() {
    const colors = useColors();
    const { width, height } = useActiveBoard();
    // const texture: any = useTexture('/assets/map.png');

    return (
        <>
            <mesh position={[ 0, 0, -1 ]} receiveShadow={true}>
                <planeBufferGeometry args={[ width + 2, height + 2 ]} attach="geometry" />
                <shadowMaterial attach="material" transparent opacity={0.5} />
            </mesh>
            <mesh position={[ 0, 0, -1 ]}>
                <planeBufferGeometry args={[ width, height ]} attach="geometry" />
                {/*<meshBasicMaterial map={texture} attach="material" />*/}
                <meshBasicMaterial color={new Color(colors.backgroundAlwaysLight)} attach="material" />
            </mesh>
        </>
    );
}
