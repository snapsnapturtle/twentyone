import { useStyletron } from 'baseui';
import { Button } from 'baseui/button';
import { ButtonGroup, SIZE } from 'baseui/button-group';
import React, { useContext } from 'react';
import { TokenCreator } from '../../board/components/TokenCreator';
import { ToolContext } from '../contexts/ToolContext';
import { Tool } from '../enums/Tool';
import { UserPreferences } from '../../preferences/components/UserPreferences';

const iconMap = {
    [ Tool.NORMAL ]: (
        <svg viewBox="0 0 24 24" id="img__cursor-24" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px">
            <path
                fill="currentColor" fillRule="evenodd" d="M7 19l4.394-2.59 1.86 4.661a1 1 0 0 0 1.3.558l.499-.2a1 1 0 0 0 .557-1.3l-1.86-4.66L18.5 14 7 2v17z"
            />
        </svg>
    ),
    [ Tool.POINTER ]: (
        <svg width="20px" height="20px" viewBox="0 0 24 24" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink">
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <circle id="Oval" stroke="currentColor" strokeWidth="6" cx="12" cy="12" r="8" />
            </g>
        </svg>
    )
};

const buttonStyles = {
    marinTop: 0,
    marinBottom: 0,
    marinLeft: 0,
    marinRight: 0
};

export function Toolbox() {
    const theme = useStyletron()[ 1 ];
    const { availableTools, activeTool, setTool } = useContext(ToolContext);

    return (
        <div
            style={{
                display: 'inline-block',
                position: 'absolute',
                top: '50%',
                left: '1em',
                transform: 'translateY(-100%)',
                boxShadow: theme.lighting.shadow500
            }}
        >
            <ButtonGroup
                size={SIZE.compact} selected={availableTools.findIndex(it => it.tool === activeTool)}
                overrides={{ Root: { style: { flexDirection: 'column' } } }}
            >
                {availableTools.map(it =>
                    <Button
                        key={it.tool}
                        onClick={() => setTool(it.tool)}
                        overrides={{ BaseButton: { style: buttonStyles } }}
                    >
                        {iconMap[ it.tool ]}
                    </Button>)}

                <UserPreferences />
                <TokenCreator />
            </ButtonGroup>
        </div>
    );
}
