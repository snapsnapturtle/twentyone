import { useStyletron } from 'baseui';
import { Button } from 'baseui/button';
import React, { useState } from 'react';
import { useGameStore } from '../../hooks/useGameStore';
import { DiceType } from './hooks/useCreateDice';

function SelectedDice(props: { amount: number }) {
    if (props.amount > 0) {
        return <>x{props.amount}</>;
    }

    return null;
}

export function DiceSelector() {
    const [ css, theme ] = useStyletron();
    const [ selectedDice, setSelectedDice ] = useState<DiceType[]>([]);
    const setDice = useGameStore(state => state.setDice);

    const handleDiceAdd = (diceType: DiceType) => (e: React.MouseEvent) => {
        setSelectedDice(current => current.concat([ diceType ]));
    };

    const handleRollClick = () => {
        const rollDice = selectedDice.map(it => ({
            diceType: it,
            result: 1
        }));

        console.log(rollDice);

        setSelectedDice([]);
        setDice(rollDice);
    };

    return (
        <div
            className={css({
                position: 'absolute',
                bottom: '2em',
                left: 'calc(50% - 160px)',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                boxShadow: theme.lighting.shadow600,
                background: theme.colors.backgroundTertiary
            })}
        >
            <Button kind="secondary" onClick={handleDiceAdd('d4')}>
                D4 <SelectedDice amount={selectedDice.filter(it => it === 'd4').length} />
            </Button>
            <Button kind="secondary" onClick={handleDiceAdd('d6')}>
                D6 <SelectedDice amount={selectedDice.filter(it => it === 'd6').length} />
            </Button>
            <Button kind="secondary" onClick={handleDiceAdd('d8')} disabled>
                D8
            </Button>
            <Button kind="secondary" onClick={handleDiceAdd('d10')} disabled>
                D10
            </Button>
            <Button kind="secondary" onClick={handleDiceAdd('d12')}>
                D12 <SelectedDice amount={selectedDice.filter(it => it === 'd12').length} />
            </Button>
            <Button kind="secondary" onClick={handleDiceAdd('d20')}>
                D20 <SelectedDice amount={selectedDice.filter(it => it === 'd20').length} />
            </Button>

            {selectedDice.length > 0 && <Button onClick={handleRollClick} $style={{marginLeft: theme.sizing.scale400}}>Roll!</Button>}
        </div>
    );
}
