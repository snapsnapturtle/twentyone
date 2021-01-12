import { io } from 'socket.io-client';

export const connection = io('https://twentyone-300010.appspot.com', {
    transports: [ 'websocket' ],
    reconnectionAttempts: 3
});
