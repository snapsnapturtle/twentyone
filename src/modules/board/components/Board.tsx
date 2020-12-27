import { Stats, useContextBridge } from '@react-three/drei';
import React, { createRef, Suspense, useEffect, useState } from 'react';
import { Canvas } from 'react-three-fiber';
import { CanvasLoading } from '../../../shared/components/CanvasLoading';
import { connection } from '../../../shared/connection';
import { UserPreferencesContext } from '../../preferences/contexts/UserPreferencesContext';
import { useUserPreferences } from '../../preferences/hooks/useUserPreferences';
import { ToolContext } from '../../toolbox/contexts/ToolContext';
import { Tool } from '../../toolbox/enums/Tool';
import { useActiveTool } from '../../toolbox/hooks/useActiveTool';
import { ColorsContext } from '../context/ColorsContext';
import { CircleRuler } from './CircleRuler';
import { MoveControls } from './MoveControls';
import { PolyLineRuler } from './PolyLineRuler';
import { SquareGridMap } from './SquareGridMap';
import { Token } from './Token';

export const Board = () => {
    const tool = useActiveTool();
    const userPreferences = useUserPreferences();
    const ContextBridge = useContextBridge(ToolContext, UserPreferencesContext, ColorsContext);

    const [ players, setPlayers ] = useState<{ id: number, x: number, y: number, isDragging?: boolean }[]>([]);
    const canvasRef = createRef<HTMLDivElement>();

    useEffect(() => {
        // @ts-ignore
        connection.on('positions_changed', (res) => {
            setPlayers(res);
        });

        return () => {
            connection.off('positions_changed');
        };
    }, []);


    return (
        <div ref={canvasRef} style={{ height: '100%' }}>
            <Canvas
                concurrent
                orthographic={true}
                pixelRatio={userPreferences.devicePixelRatio}
                colorManagement={false}
                camera={{ zoom: 60, position: [ 0, 0, 10 ], up: [ 0, 0, 1 ], far: 10000 }}
            >
                <ContextBridge>
                    <Suspense fallback={<CanvasLoading />}>
                        <Stats />
                        <MoveControls />
                        <ambientLight intensity={1} />
                        <SquareGridMap
                            width={25}
                            height={13}
                        />
                        {tool === Tool.RULER_LINE && <PolyLineRuler />}
                        {tool === Tool.RULER_CIRCLE && <CircleRuler />}
                        {players.map(it => <Token key={it.id} id={it.id} position={[ it.x, it.y ]} assetUrl="assets/Goblin.png" />)}
                    </Suspense>
                </ContextBridge>
            </Canvas>
        </div>
    );
};