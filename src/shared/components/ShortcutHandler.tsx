import { useContext, useEffect } from 'react';
import { ToolContext } from '../../modules/toolbox/contexts/ToolContext';
import { Tool } from '../../modules/toolbox/enums/Tool';

export function ShortcutHandler() {
    const { setTool } = useContext(ToolContext);

    const handler = (event: KeyboardEvent) => {
        switch (event.key) {
            case 'v':
                setTool(Tool.NORMAL);
                break;
            case 'p':
                setTool(Tool.POINTER);
                break;
            case 'r':
                setTool(Tool.RULER);
                break;
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
