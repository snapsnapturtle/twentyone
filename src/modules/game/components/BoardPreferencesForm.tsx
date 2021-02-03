import { Block } from 'baseui/block';
import { Button } from 'baseui/button';
import { Card } from 'baseui/card';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { OptionsT, Select } from 'baseui/select';
import { HeadingMedium, HeadingSmall } from 'baseui/typography';
import React, { FormEvent, useState } from 'react';
import { ColorPickerButton } from '../../../shared/components/ColorPickerButton';
import { useActiveBoard } from '../hooks/useActiveBoard';
import { GridType } from '../types/BoardPreferences';

export function BoardPreferencesForm() {
    const boardPreferences = useActiveBoard();
    const [ loading, setLoading ] = useState<boolean>(false);

    const [ boardWidth, setBoardWidth ] = useState<string>(boardPreferences.width.toString());
    const [ boardHeight, setBoardHeight ] = useState<string>(boardPreferences.height.toString());
    const [ gridType, setGridType ] = useState<'NONE' | 'SQUARE'>(boardPreferences.gridType);
    const [ gridLineColor, setGridLineColor ] = useState<string | undefined>(boardPreferences.gridLineColor);

    const gridOptions: OptionsT = [
        {
            label: 'None',
            id: 'NONE'
        },
        {
            label: 'Square Grid',
            id: 'SQUARE'
        }
    ];

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (loading) {
            return;
        }

        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            // updateBoardPreferences({
            //     width: Number.parseInt(boardWidth),
            //     height: Number.parseInt(boardHeight),
            //     grid: {
            //         type: gridType,
            //         lineColor: gridLineColor
            //     }
            // });
        }, 1000);

    };

    const handleResetForm = () => {
        setBoardWidth(boardPreferences.width.toString());
        setBoardHeight(boardPreferences.height.toString());
        setGridType(boardPreferences.gridType);
        setGridLineColor(boardPreferences.gridLineColor);
    };

    return (
        <Card overrides={{ Root: { style: { position: 'absolute', top: '2em', right: '2em', width: '25em', height: 'auto' } } }}>
            <HeadingMedium>Board Preferences</HeadingMedium>

            <form onSubmit={handleSubmit}>
                <Block display="grid" gridTemplateColumns="auto auto" gridColumnGap="1em">
                    <div>
                        <FormControl label="Width">
                            <Input value={boardWidth} onChange={(e: any) => setBoardWidth(e.target.value)} />
                        </FormControl>
                    </div>
                    <div>
                        <FormControl label="Height">
                            <Input value={boardHeight} onChange={(e: any) => setBoardHeight(e.target.value)} />
                        </FormControl>
                    </div>
                </Block>

                <HeadingSmall>Grid</HeadingSmall>

                <FormControl
                    label="Grid" caption={gridType === GridType.NONE ? 'Disabling the grid will also disable any grid snapping effects, since' +
                    ' there\'s nothing for the objects to snap to.' : null}
                >
                    <Select
                        value={gridOptions.filter(it => it.id === gridType)}
                        options={gridOptions}
                        onChange={params => setGridType(params.value[ 0 ].id as any)}

                        clearable={false}
                        searchable={false}
                    />
                </FormControl>
                {gridType !== GridType.NONE && <div>
                    <FormControl label="Line color">
                        <ColorPickerButton color={gridLineColor || '#444444'} onColorChange={c => setGridLineColor(c)}>
                            Change Color
                        </ColorPickerButton>
                    </FormControl>
                </div>}
                <br />
                <br />
                <Button type="submit" isLoading={loading}>Apply to Board</Button>&nbsp;&nbsp;
                <Button kind="secondary" type="reset" onClick={handleResetForm}>Cancel</Button>
            </form>
        </Card>
    );
}
