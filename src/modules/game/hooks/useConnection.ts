import { useMemo } from 'react';
import { io, Socket } from 'socket.io-client';

let connection: Socket;

const initiateConnection = (room: string) => {
    if (!connection) {
        console.log('Creating new connection to socket');
        connection = io('https://twentyone-backend.herokuapp.com', {
            transports: [ 'websocket' ],
            reconnectionAttempts: 3,
            query: 'r_var=' + room
        });
    }

    return connection;
};

export function useConnection(sessionKey: string): Socket {
    return useMemo(() => {
        initiateConnection(sessionKey);

        return connection;
    }, [ sessionKey ]);
}
