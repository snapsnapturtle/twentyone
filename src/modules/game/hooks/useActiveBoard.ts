import { useContext } from 'react';
import { SessionContext } from '../context/SessionContext';

export function useActiveBoard() {
    const { activeBoard } = useContext(SessionContext);

    return activeBoard;
}
