import { toaster } from 'baseui/toast';
import React, { ReactText, useCallback, useEffect } from 'react';
import { useConnection } from '../hooks/useConnection';

export function SocketConnectionStatus(props: { sessionKey: string }) {
    const connection = useConnection(props.sessionKey);

    const [ reconnectToastKey, setReconnectToastKey ] = React.useState<ReactText>();

    const showToast = useCallback(() => {
        if (!reconnectToastKey) {
            setReconnectToastKey(toaster.info('Attempting to connect to server again..', {}));
        }
    }, [ reconnectToastKey ]);

    const closeToast = useCallback(() => {
        if (reconnectToastKey) {
            toaster.clear(reconnectToastKey);
            setReconnectToastKey(undefined);
        }
    }, [ reconnectToastKey ]);

    useEffect(() => {
        connection.io.on('reconnect', () => {
            closeToast();
        });

        // all errors are on the 'error' event, but the first reconnect should not be shown to the user
        connection.io.on('reconnect_error', () => {
            showToast();
        });

        connection.io.on('reconnect_failed', () => {
            alert('Failed to reconnect, please refresh the page');
        });

        return () => {
            connection?.io.off('reconnect');
            connection?.io.off('reconnect_error');
            connection?.io.off('reconnect_failed');
        };

    }, [ connection, closeToast, showToast ]);

    return null;
}
