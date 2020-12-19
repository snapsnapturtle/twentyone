import { useContext, useEffect } from 'react';
import { ToolContext } from '../../modules/toolbox/contexts/ToolContext';
import { Tool } from '../../modules/toolbox/enums/Tool';

export function ShortcutHandler() {
    const { setTool } = useContext(ToolContext);

    const handler = (event: KeyboardEvent) => {
        if (event.key === 'v') {
            setTool(Tool.NORMAL);
        }

        if (event.key === 'p') {
            setTool(Tool.POINTER);
        }
    };

    useEffect(() => {
        global.addEventListener('keydown', handler);

        return () => {
            global.removeEventListener('keydown', handler);
        };
    });

    return null;
}
