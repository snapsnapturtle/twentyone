import React, { createRef, MutableRefObject, Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import * as THREE from 'three';
import { Color } from 'three';
import { CanvasLoading } from '../../../shared/components/CanvasLoading';
import { connection } from '../../../shared/connection';
import { useColors } from '../../../shared/hooks/useColors';
import { useUserPreferences } from '../../preferences/hooks/useUserPreferences';
import { Tool } from '../../toolbox/enums/Tool';
import { useActiveTool } from '../../toolbox/hooks/useActiveTool';
import { useRelativeMousePosition } from '../hooks/useRelativeMousePosition';
import { MoveControls } from './MoveControls';
import { SquareGridMap } from './SquareGridMap';
import { Token } from './Token';

const LaserPointer = ({ position }: { position: MutableRefObject<number[]> }) => {
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

export const Board = () => {
    const colors = useColors();
    const tool = useActiveTool();
    const userPreferences = useUserPreferences();

    const [ players, setPlayers ] = useState<{ id: number, x: number, y: number, isDragging?: boolean }[]>([]);
    const canvasRef = createRef<HTMLDivElement>();
    const mousePositionRef = useRef<number[]>([ 0, 0 ]);

    useEffect(() => {
        // @ts-ignore
        connection.on('positions_changed', (res) => {
            setPlayers(res);
        });

        return () => {
            connection.off('positions_changed');
        };
    }, []);

    const handleMouseMove = ({ clientX: x, clientY: y }: React.MouseEvent<HTMLDivElement>) => {
        if (mousePositionRef.current && canvasRef.current) {
            mousePositionRef.current = [ x, y ];
        }
    };

    return (
        <div ref={canvasRef} style={{ height: '100%' }}>
            <Canvas
                concurrent
                orthographic={true}
                pixelRatio={userPreferences.devicePixelRatio}
                camera={{ zoom: 60, position: [ 0, 0, 10 ], up: [ 0, 0, 1 ], far: 10000 }}
                onMouseMove={handleMouseMove}
            >
                <Suspense fallback={<CanvasLoading />}>
                    <MoveControls />
                    <ambientLight intensity={1.5} args={[ new Color(colors.backgroundAlwaysLight) ]} />
                    <SquareGridMap
                        width={21}
                        height={11}
                        color={colors.borderOpaque}
                        backgroundColor={colors.backgroundSecondary}
                    />
                    {tool === Tool.POINTER && <LaserPointer position={mousePositionRef} />}
                    {players.map(it => <Token key={it.id} id={it.id} position={[ it.x, it.y ]} assetUrl="assets/Goblin.png" />)}
                </Suspense>
            </Canvas>
        </div>
    );
};
