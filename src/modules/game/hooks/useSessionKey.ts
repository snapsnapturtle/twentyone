import { useContext } from 'react';
import { SessionContext } from '../context/SessionContext';

export function useSessionKey(): string {
    const { session } = useContext(SessionContext);

    return session.key;
}
