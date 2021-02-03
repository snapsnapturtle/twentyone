import { useContextBridge } from '@react-three/drei';
import React, { createRef, Suspense, useEffect, useState } from 'react';
import { Canvas } from 'react-three-fiber';
import { UserPreferencesContext } from '../../../../preferences/contexts/UserPreferencesContext';
import { useUserPreferences } from '../../../../preferences/hooks/useUserPreferences';
import { BoardPreferencesForm } from '../../../components/BoardPreferencesForm';
import { SessionContext } from '../../../context/SessionContext';
import { useActiveBoard } from '../../../hooks/useActiveBoard';
import { useConnection } from '../../../hooks/useConnection';
import { GridType } from '../../../types/BoardPreferences';
import { DiceSix } from '../../dice/DiceSix';
import { ToolContext } from '../../toolbox/contexts/ToolContext';
import { Tool } from '../../toolbox/enums/Tool';
import { useActiveTool } from '../../toolbox/hooks/useActiveTool';
import { ColorsContext } from '../context/ColorsContext';
import { BoardBackground } from './BoardBackground';
import { CanvasLoading } from './CanvasLoading';
import { CircleRuler } from './CircleRuler';
import { Lighting } from './Lighting';
import { MoveControls } from './MoveControls';
import { PolyLineRuler } from './PolyLineRuler';
import { SquareGridMap } from './SquareGridMap';
import { Token } from './Token';

export const Board = () => {
    const tool = useActiveTool();
    const userPreferences = useUserPreferences();
    const ContextBridge = useContextBridge(ToolContext, UserPreferencesContext, ColorsContext, SessionContext);
    const connection = useConnection();
    const canvasRef = createRef<HTMLDivElement>();
    const [ tokens, setTokens ] = useState<{ id: number, x: number, y: number }[]>();
    const { gridType } = useActiveBoard();

    useEffect(() => {
        connection.on('all_tokens_changed', (res: []) => {
            setTokens(res);
        });

        connection.emit('request_session_init');

        return () => {
            connection.off('all_tokens_changed');
        };
    }, [ connection ]);

    return (
        <div ref={canvasRef} style={{ height: '100%', width: '100%' }}>
            <Canvas
                concurrent
                orthographic={true}
                shadowMap={true}
                pixelRatio={userPreferences.devicePixelRatio}
                colorManagement={false}
                camera={{ zoom: 60, up: [ 0, 0, 1 ], far: 10000, near: 0.1 }}
            >
                <ContextBridge>
                    <Suspense fallback={<CanvasLoading />}>
                        <BoardBackground />
                        {gridType === GridType.SQUARE && <SquareGridMap />}
                        <Lighting />
                        <MoveControls />
                        <DiceSix />
                        {tool === Tool.RULER_LINE && <PolyLineRuler />}
                        {tool === Tool.RULER_CIRCLE && <CircleRuler />}
                        {tokens && tokens.map(it => <Token
                            key={it.id} id={it.id} position={[ it.x, it.y ]} assetUrl="/assets/Goblin.png"
                        />)}
                    </Suspense>
                </ContextBridge>
            </Canvas>
            {/*<BoardPreferencesForm />*/}
        </div>
    );
};
