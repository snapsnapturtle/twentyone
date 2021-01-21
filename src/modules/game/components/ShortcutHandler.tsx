import { useContext, useEffect } from 'react';
import { ToolContext } from '../modules/toolbox/contexts/ToolContext';
import { Tool } from '../modules/toolbox/enums/Tool';

export function ShortcutHandler() {
    const { setTool } = useContext(ToolContext);

    useEffect(() => {
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


        global.addEventListener('keydown', handler);

        return () => {
            global.removeEventListener('keydown', handler);
        };
    }, [ setTool ]);

    return null;
}
