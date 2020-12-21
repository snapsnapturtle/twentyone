import { useStyletron } from 'baseui';
import { Button } from 'baseui/button';
import { ButtonGroup, SIZE } from 'baseui/button-group';
import React, { useContext } from 'react';
import { TokenCreator } from '../../board/components/TokenCreator';
import { UserPreferences } from '../../preferences/components/UserPreferences';
import { ToolContext } from '../contexts/ToolContext';
import { Tool } from '../enums/Tool';

const iconMap = {
    [ Tool.NORMAL ]: (
        <svg viewBox="0 0 24 24" id="img__cursor-24" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px">
            <path
                fill="currentColor" fillRule="evenodd" d="M7 19l4.394-2.59 1.86 4.661a1 1 0 0 0 1.3.558l.499-.2a1 1 0 0 0 .557-1.3l-1.86-4.66L18.5 14 7 2v17z"
            />
        </svg>
    ),
    [ Tool.POINTER ]: (
        <svg viewBox="0 0 24 24" id="newlayout__link-arrow" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px">
            <path fill="currentColor" d="M14.293 8.293l-11 11a1 1 0 0 0 1.414 1.414l11-11L18 12l3-9-9 3 2.293 2.293z" />
        </svg>
    ),
    [ Tool.RULER ]: (
        <svg enableBackground="new 0 0 512 512" height="20px" viewBox="0 0 512 512" width="20px" xmlns="http://www.w3.org/2000/svg">
            <path
                fill="currentColor"
                d="M507.586,98.766L413.236,4.415c-5.884-5.885-15.427-5.885-21.312,0L4.415,391.923C1.587,394.75,0,398.582,0,402.579
			c0,3.998,1.587,7.83,4.415,10.656l94.351,94.351c2.943,2.943,6.8,4.415,10.656,4.415s7.714-1.471,10.656-4.415l387.51-387.508
			c2.826-2.826,4.415-6.659,4.415-10.656C512,105.425,510.413,101.592,507.586,98.766z M109.421,475.618L36.383,402.58
			l26.927-26.927l21.863,21.864c2.943,2.943,6.8,4.415,10.656,4.415c3.856,0,7.714-1.472,10.656-4.414
			c5.885-5.885,5.885-15.427,0-21.312l-21.863-21.864l27.193-27.193l21.864,21.864c2.943,2.943,6.8,4.414,10.656,4.414
			c3.856,0,7.714-1.471,10.656-4.415c5.885-5.885,5.885-15.427,0-21.312l-21.864-21.863l27.193-27.193l21.864,21.864
			c2.943,2.943,6.8,4.415,10.656,4.415c3.856,0,7.714-1.471,10.656-4.415c5.885-5.885,5.885-15.427,0-21.312l-21.864-21.864
			l27.193-27.193l21.864,21.864c2.943,2.943,6.8,4.415,10.656,4.415s7.714-1.471,10.656-4.415c5.885-5.885,5.885-15.427,0-21.312
			l-21.864-21.864l27.193-27.193l21.863,21.864c2.943,2.943,6.8,4.415,10.656,4.415c3.856,0,7.714-1.472,10.656-4.414
			c5.885-5.885,5.885-15.427,0-21.312l-21.863-21.864l27.193-27.193l21.864,21.864c2.943,2.943,6.8,4.414,10.656,4.414
			s7.714-1.471,10.656-4.415c5.885-5.885,5.885-15.427,0-21.312l-21.863-21.863l27.193-27.193l21.863,21.863
			c2.943,2.943,6.8,4.415,10.656,4.415s7.714-1.471,10.656-4.415c5.885-5.885,5.885-15.427,0-21.312l-21.863-21.863l26.927-26.927
			l73.039,73.037L109.421,475.618z"
            />
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
                transform: 'translateY(-50%)',
                boxShadow: theme.lighting.shadow600
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
