import { useStyletron } from 'baseui';
import { Button } from 'baseui/button';
import { ButtonGroup } from 'baseui/button-group';
import { Input } from 'baseui/input';
import React, { createRef, MutableRefObject, Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import * as THREE from 'three';
import { useRelativeMousePosition } from '../hooks/useRelativeMousePosition';
import { connection } from '../shared/connection';
import { MoveControls } from './MoveControls';
import { Player } from './Player';

interface BattleMapProps {
    width?: number;
    height?: number;
}

function BattleMap({ width = 25, height = 25 }: BattleMapProps) {
    const theme = useStyletron()[1]
    return (
        <mesh position={[ 0, 0, -1 ]}>
            <planeBufferGeometry args={[ width, height, 1, 1 ]} />
            <meshStandardMaterial color={theme.colors.backgroundAlt} />
        </mesh>
    );
}

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
        <mesh ref={mesh} position={[ 0, 0, 0 ]} scale={[ 1, 1, 1 ]}>
            <circleBufferGeometry args={[ 1, 32 ]} />
            <meshStandardMaterial color="blue" wireframe />
        </mesh>
    );
};


const BoardSizeConfigurator = ({ onBoardSizeChange }: any) => {
    const [ width, setWidth ] = useState<number>(20);
    const [ height, setHeight ] = useState<number>(10);

    return (
        <div style={{display: 'flex'}}>
            {/* @ts-ignore */}
            <Input value={width.toString()} onChange={e => setWidth(Number.parseInt(e.target.value || '0'))} />
            {/* @ts-ignore */}
            <Input value={height.toString()} onChange={e => setHeight(Number.parseInt(e.target.value || '0'))} />
            <Button onClick={() => onBoardSizeChange({ width, height })}>SET</Button>
        </div>
    );
};

enum AvailableTools {
    NORMAL,
    POINTER
}

const tools = [ AvailableTools.NORMAL, AvailableTools.POINTER ];
const improveResolution = false;

export const Board = () => {
    const theme = useStyletron()[1];

    const [ players, setPlayers ] = useState<{ id: number, x: number, y: number, isDragging?: boolean }[]>([]);
    const [ mapSize, setMapSize ] = useState<{ width: number, height: number }>({ width: 20, height: 10 });
    const canvasRef = createRef<HTMLDivElement>();
    const mousePositionRef = useRef<number[]>([ 0, 0 ]);
    const [ tool, setTool ] = useState<AvailableTools>(AvailableTools.NORMAL);
    const [ debugMode, setDebugMode ] = useState<boolean>(false);

    useEffect(() => {
        // @ts-ignore
        connection.on('update_positions', (res) => {
            console.log(res);
            setPlayers(res);
        });

        return () => {
            connection.off('update_positions');
        };
    }, []);

    const handleMouseMove = ({ clientX: x, clientY: y }: React.MouseEvent<HTMLDivElement>) => {
        if (mousePositionRef.current && canvasRef.current) {
            mousePositionRef.current = [ x, y ];
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <ButtonGroup selected={tools.findIndex(it => it === tool)}>
                    {tools.map(tool =>
                        <Button key={tool} onClick={() => setTool(tool)}>{AvailableTools[ tool ]}</Button>)}
                </ButtonGroup>
                <BoardSizeConfigurator onBoardSizeChange={setMapSize} />
                <Button onClick={() => setDebugMode(it => !it)}>Debug: {debugMode ? 'ON' : 'OFF'}</Button>
            </div>
            <div style={{ background: theme.colors.background, height: '100%' }} ref={canvasRef}>
                <Canvas
                    concurrent
                    orthographic={true}
                    pixelRatio={improveResolution ? window.devicePixelRatio : 0.75}
                    camera={{ zoom: 50, position: [ 0, 0, 10 ], up: [ 0, 0, 1 ], far: 10000 }}
                    onMouseMove={handleMouseMove}
                >
                    <Suspense fallback={() => <h1>Loading</h1>}>
                        <MoveControls />
                        <ambientLight />
                        <BattleMap width={mapSize.width} height={mapSize.height} />
                        {debugMode && <gridHelper args={[ mapSize.width, mapSize.width ]} rotation={[ 0, Math.PI / 2, Math.PI / 2 ]} />}
                        {tool === AvailableTools.POINTER && <LaserPointer position={mousePositionRef} />}
                        {players.map(it => <Player key={it.id} id={it.id} position={[ it.x, it.y, 0 ]} />)}
                    </Suspense>
                </Canvas>

            </div>
        </div>
    );
};
