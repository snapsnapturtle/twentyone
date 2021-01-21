import { StyledSpinnerNext } from 'baseui/spinner';
import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { axiosInstance } from '../../../shared/axios';
import { ShortcutHandler } from '../components/ShortcutHandler';
import { SocketConnectionStatus } from '../components/SocketConnectionStatus';
import { Board } from '../modules/board/components/Board';
import { ColorsContextProvider } from '../modules/board/context/ColorsContext';
import { Chat } from '../modules/chat/components/Chat';
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
        return <StyledSpinnerNext />;
    }

    if (error) {
        return (
            <Redirect to="/join-session" />
        );
    }

    return (
        <>
            <SocketConnectionStatus sessionKey={sessionKey} />
            <ToolContextProvider>
                <ShortcutHandler />
                <div style={{ display: 'flex', height: '100%' }}>
                    <ColorsContextProvider>
                        <Board sessionKey={sessionKey} />
                    </ColorsContextProvider>
                    <Chat />
                </div>
                <Toolbox />
            </ToolContextProvider>
        </>
    );
}
