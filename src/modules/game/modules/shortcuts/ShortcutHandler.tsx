import React from 'react';
import { useContext, useEffect } from 'react';
import { ToolContext } from '../toolbox/contexts/ToolContext';
import { Tool } from '../toolbox/enums/Tool';
import { ShortcutInformationModal } from './ShortcutInformationModal';

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

    return <ShortcutInformationModal />;
}
