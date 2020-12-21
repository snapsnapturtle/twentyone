import { Stats, useContextBridge } from '@react-three/drei';
import React, { createRef, Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from 'react-three-fiber';
import { Color } from 'three';
import { CanvasLoading } from '../../../shared/components/CanvasLoading';
import { connection } from '../../../shared/connection';
import { useColors } from '../../../shared/hooks/useColors';
import { UserPreferencesContext } from '../../preferences/contexts/UserPreferencesContext';
import { useUserPreferences } from '../../preferences/hooks/useUserPreferences';
import { ToolContext } from '../../toolbox/contexts/ToolContext';
import { Tool } from '../../toolbox/enums/Tool';
import { useActiveTool } from '../../toolbox/hooks/useActiveTool';
import { MoveControls } from './MoveControls';
import { Pointer } from './Pointer';
import { PolyLineRuler } from './PolyLineRuler';
import { SquareGridMap } from './SquareGridMap';
import { Token } from './Token';

export const Board = () => {
    const colors = useColors();
    const tool = useActiveTool();
    const userPreferences = useUserPreferences();
    const ContextBridge = useContextBridge(ToolContext, UserPreferencesContext);

    const [ players, setPlayers ] = useState<{ id: number, x: number, y: number, isDragging?: boolean }[]>([]);
    const canvasRef = createRef<HTMLDivElement>();
    const mousePositionRef = useRef<[ x: number, y: number ]>([ 0, 0 ]);

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
                <ContextBridge>
                    <Suspense fallback={<CanvasLoading />}>
                        <Stats />
                        <MoveControls />
                        <ambientLight intensity={1.5} args={[ new Color(colors.backgroundAlwaysLight) ]} />
                        <SquareGridMap
                            width={21}
                            height={11}
                            color={colors.borderOpaque}
                            backgroundColor={colors.backgroundSecondary}
                        />
                        {tool === Tool.POINTER && <Pointer position={mousePositionRef} />}
                        {tool === Tool.RULER && <PolyLineRuler mousePosition={mousePositionRef} />}
                        {players.map(it => <Token key={it.id} id={it.id} position={[ it.x, it.y ]} assetUrl="assets/Goblin.png" />)}
                    </Suspense>
                </ContextBridge>
            </Canvas>
        </div>
    );
};
