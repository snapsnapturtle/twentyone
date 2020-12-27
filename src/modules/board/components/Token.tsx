import { useTexture } from '@react-three/drei';
import React, { useEffect, useRef } from 'react';
import { useSpring } from 'react-spring';
import { useFrame } from 'react-three-fiber';
import { addV, useDrag } from 'react-use-gesture';
import { Mesh } from 'three';
import { connection } from '../../../shared/connection';
import { Tool } from '../../toolbox/enums/Tool';
import { useActiveTool } from '../../toolbox/hooks/useActiveTool';
import { useConvertPixelToCanvas } from '../hooks/useConvertPixelToCanvas';

interface TokenProps {
    id: number;
    position: [ x: number, y: number ];
    assetUrl: string
}

export function Token(props: TokenProps) {
    const activeTool = useActiveTool();
    const staticTokenMesh = useRef<Mesh>();
    const draggableTokenMesh = useRef<Mesh>();
    const draggableTokenPosition = useRef<[ x: number, y: number ]>([ props.position[ 0 ], props.position[ 1 ] ]);
    const screenToCanvas = useConvertPixelToCanvas();
    const texture: any = useTexture(props.assetUrl);

    const [ { x, y }, set ] = useSpring<{ x: number, y: number }>(() => ({
        x: props.position[ 0 ],
        y: props.position[ 0 ]
    }));

    const bind = useDrag(({ last, movement, altKey }) => {
        const vector = addV(screenToCanvas(movement[ 0 ], movement[ 1 ]), [ props.position[ 0 ], props.position[ 1 ] ]) as [ number, number ];

        draggableTokenPosition.current = vector;

        if (last) {
            const newPosition = { x: vector[ 0 ], y: vector[ 1 ] };

            if (!altKey) {
                newPosition.x = Math.round(newPosition.x);
                newPosition.y = Math.round(newPosition.y);
            }

            connection.emit('update_position', {
                id: props.id,
                ...newPosition
            });
        }
    }, { filterTaps: true, enabled: activeTool === Tool.NORMAL });

    useEffect(() => {
        set({ x: props.position[ 0 ], y: props.position[ 1 ] });
        draggableTokenPosition.current = [ props.position[ 0 ], props.position[ 1 ] ];
    }, [ set, props.position ]);

    useFrame(() => {
        const staticToken = staticTokenMesh.current;
        const draggableToken = draggableTokenMesh.current;

        if (staticToken) {
            staticToken.position.x = x.getValue();
            staticToken.position.y = y.getValue();
        }

        if (draggableToken) {
            draggableToken.position.x = draggableTokenPosition.current[ 0 ];
            draggableToken.position.y = draggableTokenPosition.current[ 1 ];
        }
    });

    return (
        <>
            <mesh ref={draggableTokenMesh} {...bind()}>
                <planeBufferGeometry attach="geometry" />
                <meshBasicMaterial map={texture} attach="material" transparent opacity={0.5} />
            </mesh>
            <mesh ref={staticTokenMesh} position={[ props.position[ 0 ], props.position[ 1 ], -1 ]}>
                <planeBufferGeometry attach="geometry" />
                <meshBasicMaterial map={texture} attach="material" transparent />
            </mesh>
        </>
    );
}
