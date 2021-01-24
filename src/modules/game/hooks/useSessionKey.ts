import { useContext } from 'react';
import { SessionContext } from '../context/SessionContext';

export function useSessionKey(): string {
    const { sessionKey } = useContext(SessionContext);

    return sessionKey;
}
