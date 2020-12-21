import { io } from 'socket.io-client';

export const connection = io('http://localhost:4000', {
    transports: [ 'websocket' ]
});

if(!connection) {
    console.log('oh no')
}
