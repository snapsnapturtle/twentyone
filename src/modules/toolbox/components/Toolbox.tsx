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
    [ Tool.RULER_CIRCLE ]: (
        <svg enableBackground="new 0 0 512 512" height="20px" viewBox="0 0 512 512" width="20px" xmlns="http://www.w3.org/2000/svg">
            <path
                fill="currentColor"
                d="m465.185 108.394c3.954-6.694 6.233-14.49 6.233-22.811 0-24.813-20.187-45-45-45-8.322 0-16.117 2.279-22.812 6.233-47.436-33.537-105.134-49.952-163.569-46.32-62.273 3.865-120.891 30.316-165.054 74.48-48.354 48.353-74.983 112.641-74.983 181.022s26.629 132.669 74.982 181.021c48.352 48.353 112.64 74.981 181.022 74.981 68.38 0 132.668-26.629 181.021-74.981 44.164-44.163 70.615-102.781 74.48-165.054 3.628-58.441-12.784-116.135-46.32-163.571zm-23.767-22.811c0 8.271-6.729 15-15 15s-15-6.729-15-15 6.729-15 15-15 15 6.728 15 15zm-25.606 330.223c-88.119 88.118-231.497 88.12-319.617 0-42.686-42.686-66.195-99.441-66.195-159.808 0-60.368 23.508-117.122 66.195-159.809 77.216-77.215 199.172-87.708 288.056-26.311-1.828 4.892-2.833 10.183-2.833 15.705 0 6.939 1.581 13.514 4.398 19.389l-110.426 110.426c-5.875-2.817-12.451-4.398-19.39-4.398-24.813 0-45 20.187-45 45s20.187 45 45 45 45-20.187 45-45c0-6.939-1.581-13.514-4.398-19.389l110.426-110.426c5.875 2.817 12.451 4.398 19.389 4.398 5.522 0 10.812-1.005 15.705-2.833 61.399 88.885 50.905 210.84-26.31 288.056zm-144.812-159.806c0 8.271-6.729 15-15 15s-15-6.729-15-15 6.729-15 15-15c8.272 0 15 6.729 15 15z"
            />
        </svg>
    ),
    [ Tool.RULER_LINE ]: (
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
