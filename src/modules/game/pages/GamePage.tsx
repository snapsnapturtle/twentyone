import React from 'react';
import { useParams } from 'react-router-dom';
import { AvailableBoards } from '../components/AvailableBoards';
import { SocketConnectionStatus } from '../components/SocketConnectionStatus';
import { CampaignContextProvider } from '../context/CampaignContext';
import { Board } from '../modules/board/components/Board';
import { ColorsContextProvider } from '../modules/board/context/ColorsContext';
import { DiceSelector } from '../modules/dice/components/DiceSelector';
import { ShortcutHandler } from '../modules/shortcuts/ShortcutHandler';
import { Toolbox } from '../modules/toolbox/components/Toolbox';
import { ToolContextProvider } from '../modules/toolbox/contexts/ToolContext';

export function GamePage() {
    const { campaignId } = useParams<{ campaignId: string }>();

    return (
        <CampaignContextProvider campaignId={Number.parseInt(campaignId)}>
            <SocketConnectionStatus />
            <ToolContextProvider>
                <ShortcutHandler />
                <ColorsContextProvider>
                    <div style={{ display: 'flex', height: '100%' }}>
                        <Board />
                    </div>
                </ColorsContextProvider>
                <DiceSelector />
                <Toolbox />
                <AvailableBoards />
            </ToolContextProvider>
        </CampaignContextProvider>
    );
}
