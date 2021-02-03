import { useStyletron } from 'baseui';
import { Block } from 'baseui/block';
import { Button } from 'baseui/button';
import { StatefulPopover } from 'baseui/popover';
import React, { FC, useState } from 'react';
import { SketchPicker } from 'react-color';

interface ColorPickerButtonProps {
    color: string;
    onColorChange: (color: string) => void
}

export const ColorPickerButton: FC<ColorPickerButtonProps> = (props) => {
    const [ css, theme ] = useStyletron();
    const [ currentColor, setCurrentColor ] = useState<string>(props.color);

    return (
        <StatefulPopover
            content={() => (
                <Block>
                    <SketchPicker
                        color={currentColor}
                        onChange={c => setCurrentColor(c.hex)}
                        onChangeComplete={c => props.onColorChange(c.hex)}
                        presetColors={[ '#545454', '#00fff0', '#ff0000' ]}
                        disableAlpha
                        styles={{ 'default': { picker: { backgroundColor: theme.colors.backgroundAlwaysLight } } }}
                    />
                </Block>
            )}
        >
            <Button kind="secondary" size="compact" type="button">
                {props.children}
                <div className={css({ width: '1em', height: '1em', marginLeft: '1em' })} style={{ backgroundColor: props.color }} />
            </Button>
        </StatefulPopover>
    );
};
