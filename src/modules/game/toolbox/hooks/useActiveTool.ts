import { useContext } from 'react';
import { ToolContext } from '../contexts/ToolContext';

export function useActiveTool() {
    const { activeTool } = useContext(ToolContext);

    return activeTool;
}
