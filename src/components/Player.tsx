import { useTexture } from '@react-three/drei';
import React, { useEffect, useRef, useState } from 'react';
import { config, useSpring } from 'react-spring';
import { useFrame } from 'react-three-fiber';
import { useDrag } from 'react-use-gesture';
import { Mesh } from 'three';
import { useRelativeMousePosition } from '../hooks/useRelativeMousePosition';
import { connection } from '../shared/connection';

interface PlayerProps {
    id: number;
    position: [ number, number, number ];
}

export function Player(props: PlayerProps) {
    const mesh = useRef<Mesh>();
    const [ dragging, setDragging ] = useState(false);
    const relativeMousePosition = useRelativeMousePosition();
    const texture: any = useTexture('assets/Goblin.png');
    const [ { x, y }, set ] = useSpring<{ x: number, y: number }>(() => ({ x: props.position[ 0 ], y: props.position[ 0 ], config: config.stiff }));

    const handlePlayerMove = (vector: [ number, number ]) => {
        connection.emit('send_position', {
            id: props.id,
            x: vector[ 0 ],
            y: vector[ 1 ]
        });
    };

    const bind = useDrag(({ last, xy, first }) => {
        const vector = relativeMousePosition(xy[ 0 ], xy[ 1 ]);

        set({ x: vector[ 0 ], y: vector[ 1 ] });

        if (first) {
            setDragging(true);
        }

        if (last) {
            handlePlayerMove(vector);
            setDragging(false);
        }
    }, { filterTaps: true });

    useFrame(() => {
        const box = mesh.current;

        if (box) {
            box.position.x = x.getValue();
            box.position.y = y.getValue();
        }
    });

    useEffect(() => {
        set({ x: props.position[ 0 ], y: props.position[ 1 ] });
    }, [ set, props.position ]);

    return (
        <mesh
            ref={mesh}
            scale={dragging ? [1.1, 1.1, 1.1] : [ 1,1,1 ]}
            {...bind()}
        >
            <planeBufferGeometry attach="geometry" />
            <meshStandardMaterial map={texture} attach="material" transparent />
        </mesh>
    );
}
