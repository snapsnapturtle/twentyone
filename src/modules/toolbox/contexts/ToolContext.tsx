import { createContext, Dispatch, FC, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { Tool } from '../enums/Tool';

export interface ToolInformation {
    tool: Tool,
    name: string;
    icon: ReactNode;
}

interface IToolContext {
    activeTool: Tool,
    setTool: Dispatch<SetStateAction<Tool>>,
    toolMap: { tool: Tool, children?: Tool[] }[]
}

export const ToolContext = createContext<IToolContext>({
    activeTool: Tool.NORMAL,
    setTool: () => {
    },
    toolMap: []
});

export const availableTools: Map<Tool, ToolInformation> = new Map([
    [
        Tool.NORMAL,
        {
            tool: Tool.NORMAL,
            name: 'Normal',
            icon: (
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24px" height="24px">
                    <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M7 19l4.394-2.59 1.86 4.661a1 1 0 0 0 1.3.558l.499-.2a1 1 0 0 0 .557-1.3l-1.86-4.66L18.5 14 7 2v17z"
                    />
                </svg>
            )
        }
    ],
    [
        Tool.RULER_LINE,
        {
            tool: Tool.RULER_LINE,
            name: 'Ruler (Line)',
            icon: (
                <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <g id="Ruler" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <circle id="Oval" fill="currentColor" cx="21" cy="3" r="2" />
                        <circle id="Oval" fill="currentColor" cx="3" cy="21" r="2" />
                        <line
                            x1="3.73575462" y1="21.6446609" x2="20.3021984" y2="2.31714318" id="Line" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="square"
                            transform="translate(11.760848, 11.743392) rotate(4.398705) translate(-11.760848, -11.743392) "
                        />
                    </g>
                </svg>
            )
        }
    ],
    [
        Tool.RULER_CIRCLE,
        {
            tool: Tool.RULER_CIRCLE,
            name: 'Ruler (Circle)',
            icon: (
                <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <g id="Circle" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <circle id="Oval" stroke="currentColor" strokeWidth="2" cx="12" cy="12" r="10" />
                        <line
                            x1="12.278747" y1="12.2581284" x2="18.721253" y2="4.74187155" id="Line" stroke="currentColor" strokeWidth="2" strokeLinecap="square"
                            strokeDasharray="1,3" transform="translate(15.500000, 8.500000) rotate(4.398705) translate(-15.500000, -8.500000) "
                        />
                    </g>
                </svg>
            )
        }
    ],
    [
        Tool.RULER_CONE,
        {
            tool: Tool.RULER_CONE,
            name: 'Ruler (Cone)',
            icon: (
                <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <g id="Cone" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="square" strokeLinejoin="round">
                        <path
                            d="M10,3 L2.93053785,20.9707204 L21,14 C21,10.6666667 20,8 18,6 C16,4 13.3333333,3 10,3 Z" id="Path-2" stroke="currentColor"
                            strokeWidth="2"
                        />
                    </g>
                </svg>
            )
        }
    ]
]);

const availableRulers = [ Tool.RULER_LINE, Tool.RULER_CIRCLE, Tool.RULER_CONE ];

export const ToolContextProvider: FC = (props) => {
    const [ tool, setTool ] = useState<Tool>(Tool.NORMAL);
    const [ lastRuler, setLastRuler ] = useState<Tool>(Tool.RULER_LINE);

    const toolMap = [ {
        tool: Tool.NORMAL
    }, {
        tool: lastRuler,
        children: availableRulers
    } ];

    useEffect(() => {
        if (availableRulers.includes(tool)) {
            setLastRuler(tool);
        }
    }, [ tool ]);

    const context: IToolContext = {
        activeTool: tool,
        setTool,
        toolMap
    };

    return <ToolContext.Provider {...props} value={context} />;
};
