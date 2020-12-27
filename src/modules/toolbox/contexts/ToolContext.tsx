import { createContext, Dispatch, FC, SetStateAction, useState } from 'react';
import { Tool } from '../enums/Tool';

interface ToolInformation {
    tool: Tool,
    name: string;
}

interface IToolContext {
    activeTool: Tool,
    availableTools: ToolInformation[];
    setTool: Dispatch<SetStateAction<Tool>>
}

export const ToolContext = createContext<IToolContext>({
    activeTool: Tool.NORMAL,
    availableTools: [],
    setTool: () => {
    }
});

export const ToolContextProvider: FC = (props) => {
    const [ tool, setTool ] = useState<Tool>(Tool.NORMAL);
    const availableTools = [ {
        tool: Tool.NORMAL,
        name: 'Normal'
    }, {
        tool: Tool.RULER_LINE,
        name: 'Ruler'
    }, {
        tool: Tool.RULER_CIRCLE,
        name: 'Ruler (Circle)'
    } ];

    const context: IToolContext = {
        activeTool: tool,
        setTool,
        availableTools
    };

    return <ToolContext.Provider {...props} value={context} />;
};
