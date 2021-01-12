import { io } from 'socket.io-client';

export const connection = io('http://twentyone-300010.appspot.com', {
    transports: [ 'websocket' ],
    reconnectionAttempts: 3
});
