import { useStyletron } from 'baseui';
import { Button } from 'baseui/button';
import { PLACEMENT, StatefulPopover, TRIGGER_TYPE } from 'baseui/popover';
import React, { FC, useContext } from 'react';
import { TokenCreator } from '../../board/components/TokenCreator';
import { UserPreferences } from '../../../../preferences/components/UserPreferences';
import { availableTools, ToolContext } from '../contexts/ToolContext';
import { Tool } from '../enums/Tool';

const MenuItem: FC<{ mapEntry: { tool: Tool, children?: Tool[] } }> = ({ mapEntry }) => {
    const { activeTool, setTool } = useContext(ToolContext);

    if (mapEntry.children === undefined) {
        return <Button onClick={() => setTool(mapEntry.tool)} kind={activeTool === mapEntry.tool ? 'primary' : 'secondary'} size="compact">
            {availableTools.get(mapEntry.tool)!!.icon}
        </Button>;
    }

    return (
        <StatefulPopover
            placement={PLACEMENT.left}
            triggerType={TRIGGER_TYPE.hover}
            content={mapEntry.children.map(it => (
                <Button key={it} onClick={() => setTool(it)} kind={activeTool === it ? 'primary' : 'secondary'} size="compact">
                    {availableTools.get(it)!!.icon}
                </Button>
            ))}
            accessibilityType={'tooltip'}
        >
            <Button onClick={() => setTool(mapEntry.tool)} kind={activeTool === mapEntry.tool ? 'primary' : 'secondary'} size="compact">
                {availableTools.get(mapEntry.tool)!!.icon}
            </Button>
        </StatefulPopover>
    );
};

export function Toolbox() {
    const theme = useStyletron()[ 1 ];
    const { toolMap } = useContext(ToolContext);

    return (
        <div
            style={{
                display: 'inline-block',
                position: 'absolute',
                top: '50%',
                left: '1em',
                transform: 'translateY(-50%)',
                boxShadow: theme.lighting.shadow600,
                background: theme.colors.backgroundTertiary
            }}
        >
            <div style={{ flexDirection: 'column', display: 'flex' }}>
                {toolMap.map(it => <MenuItem mapEntry={it} key={it.tool} />)}
                <UserPreferences />
                <TokenCreator />
            </div>
        </div>
    );
}
