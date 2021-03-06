import { StyledSpinnerNext } from 'baseui/spinner';
import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { axiosInstance } from '../../../shared/axios';
import { ShortcutHandler } from '../components/ShortcutHandler';
import { SocketConnectionStatus } from '../components/SocketConnectionStatus';
import { SessionContextProvider } from '../context/SessionContext';
import { Board } from '../modules/board/components/Board';
import { ColorsContextProvider } from '../modules/board/context/ColorsContext';
import { DiceSelector } from '../modules/dice/components/DiceSelector';
import { Toolbox } from '../modules/toolbox/components/Toolbox';
import { ToolContextProvider } from '../modules/toolbox/contexts/ToolContext';

export function GamePage() {
    const { sessionKey } = useParams<{ sessionKey: string }>();
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ error, setError ] = useState<boolean>(false);

    useEffect(() => {
        axiosInstance.get(`/v1/sessions/${sessionKey}`).then(response => {
            console.log(response.data);
        }).catch(() => {
            setError(true);
        }).finally(() => {
            setLoading(false);
        });
    }, [ sessionKey ]);


    if (loading) {
        return (
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }}>
                <StyledSpinnerNext />
            </div>
        );
    }

    if (error) {
        return (
            <Redirect to="/join-session" />
        );
    }

    return (
        <SessionContextProvider sessionKey={sessionKey}>
            <SocketConnectionStatus />
            <ToolContextProvider>
                <ShortcutHandler />
                <div style={{ display: 'flex', height: '100%' }}>
                    <ColorsContextProvider>
                        <Board />
                    </ColorsContextProvider>
                </div>
                <DiceSelector />
                <Toolbox />
            </ToolContextProvider>
        </SessionContextProvider>
    );
}
