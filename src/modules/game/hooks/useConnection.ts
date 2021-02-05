import { useContext } from 'react';
import { Socket } from 'socket.io-client';
import { ConnectionContext } from '../context/ConnectionContext';

export function useConnection(): Socket {
    const { connection } = useContext(ConnectionContext);

    return connection!!;
}
