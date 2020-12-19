import { io } from 'socket.io-client';

export const connection = io('http://192.168.178.22:4000', {
    transports: [ 'websocket' ]
});

if(!connection) {
    console.log('oh no')
}
