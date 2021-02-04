import { useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import { useCampaignId } from './useCampaignId';

let connection: Socket;

const initiateConnection = (room: string) => {
    if (!connection) {
        console.log('Creating new connection to socket');
        connection = io(process.env.REACT_APP_GATEWAY_URL!!, {
            transports: [ 'websocket' ],
            reconnectionAttempts: 3,
            query: 'r_var=' + room
        });
    }

    return connection;
};

export function useConnection(): Socket {
    const campaignId = useCampaignId();

    return useMemo(() => {
        initiateConnection(campaignId.toString());

        return connection;
    }, [ campaignId ]);
}
