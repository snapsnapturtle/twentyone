import { useContext, useEffect } from 'react';
import { ToolContext } from '../../modules/game/toolbox/contexts/ToolContext';
import { Tool } from '../../modules/game/toolbox/enums/Tool';

export function ShortcutHandler() {
    const { setTool } = useContext(ToolContext);

    const handler = (event: KeyboardEvent) => {
        switch (event.key) {
            case 'v':
                setTool(Tool.NORMAL);
                break;
            case 'r':
                setTool(Tool.RULER_LINE);
                break;
            case 'c':
                setTool(Tool.RULER_CIRCLE);
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
