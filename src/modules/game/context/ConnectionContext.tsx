import { FC, useMemo } from 'react';
import * as React from 'react';
import { io, Socket } from 'socket.io-client';

interface IConnectionContext {
    connection?: Socket
}

let globalConnection: Socket;

const initiateConnection = (room: string) => {
    if (!globalConnection) {
        console.log('Creating new connection to socket');
        globalConnection = io(process.env.REACT_APP_GATEWAY_URL!!, {
            transports: [ 'websocket' ],
            reconnectionAttempts: 3,
            query: 'r_var=' + room
        });
    }

    return globalConnection;
};


const ConnectionContext = React.createContext<IConnectionContext>({});

const ConnectionContextProvider: FC<{ campaignId: number }> = (props) => {
    const connection = useMemo(() => {
        return initiateConnection(props.campaignId.toString());
    }, [ props.campaignId ]);

    const context = {
        connection: connection
    };

    return <ConnectionContext.Provider {...props} value={context} />;
};


export {
    ConnectionContext,
    ConnectionContextProvider
};
