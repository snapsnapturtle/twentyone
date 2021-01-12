import { io } from 'socket.io-client';

export const connection = io('http://localhost:4000', {
    transports: [ 'websocket' ],
    reconnectionAttempts: 3
});
