import { Accordion, Panel } from 'baseui/accordion';
import { Block } from 'baseui/block';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { OptionsT, Select } from 'baseui/select';
import React, { FormEvent, useState } from 'react';
import { ColorPickerButton } from '../../../shared/components/ColorPickerButton';
import { Board } from '../context/CampaignContext';

interface BoardPreferencesFormProps {
    board: Omit<Board, 'id'>;
    onChange: (board: Omit<Board, 'id'>) => void
}

export function BoardPreferencesForm({ board, onChange }: BoardPreferencesFormProps) {
    const [ gridType, setGridType ] = useState<'NONE' | 'SQUARE'>(board.gridType);
    const [ gridLineColor, setGridLineColor ] = useState<string | undefined>(board.gridLineColor);

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

    const handleBoardValueChange = (e: FormEvent<HTMLInputElement>) => {
        onChange({ ...board, [ e.currentTarget.name ]: e.currentTarget.value });
    };

    return (
        <div>
            <FormControl label="Name">
                <Input name="name" value={board.name} onChange={handleBoardValueChange} />
            </FormControl>
            <Block display="grid" gridTemplateColumns="auto auto" gridColumnGap="1em">
                <div>
                    <FormControl label="Width">
                        <Input name="width" value={board.width} onChange={handleBoardValueChange} />
                    </FormControl>
                </div>
                <div>
                    <FormControl label="Height">
                        <Input name="height" value={board.height} onChange={handleBoardValueChange} />
                    </FormControl>
                </div>
            </Block>

            <Accordion>
                <Panel title="Grid">
                    <FormControl
                        label="Grid" caption={gridType === 'NONE' ? 'Disabling the grid will also disable any grid snapping effects, since' +
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
                    {gridType !== 'NONE' && <div>
                        <FormControl label="Line color">
                            <ColorPickerButton color={gridLineColor || '#444444'} onColorChange={c => setGridLineColor(c)}>
                                Change Color
                            </ColorPickerButton>
                        </FormControl>
                    </div>}
                </Panel>
            </Accordion>
        </div>
    );
}
