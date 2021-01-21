import { useStyletron } from 'baseui';
import { Button } from 'baseui/button';
import React, { useState } from 'react';
import { animated, useSpring } from 'react-spring';
import { useGameStore } from '../../hooks/useGameStore';
import { DiceType } from './hooks/useCreateDice';

export function DiceSelector() {
    const [ css, theme ] = useStyletron();
    const [ selectedDice, setSelectedDice ] = useState<DiceType[]>([]);
    const setDice = useGameStore(state => state.setDice);

    const [ style, set ] = useSpring(() => ({
        bottom: 2,
        opacity: 0
    }));

    const handleDiceAdd = (diceType: DiceType) => (e: React.MouseEvent) => {
        setSelectedDice(current => current.concat([ diceType ]));
        set({ bottom: 6, opacity: 1 });
    };

    const handleRollClick = () => {
        const rollDice = selectedDice.map(it => ({
            diceType: it,
            result: 1
        }));

        setSelectedDice([]);
        setDice(rollDice);
        set({ bottom: 2, opacity: 0 });
    };

    return (
        <>
            <animated.div
                className={css({
                    position: 'absolute',
                    left: 'calc(50% - 160px)',
                    bottom: '6em',
                    transform: 'translateX(-50%)',
                    textAlign: 'center',
                    boxShadow: theme.lighting.shadow600
                })}
                style={{
                    opacity: style.opacity,
                    bottom: style.bottom.interpolate(b => `${b}em`)
                }}
            >
                <Button onClick={handleRollClick}> Roll!</Button>
            </animated.div>

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
                    D4
                </Button>
                <Button kind="secondary" onClick={handleDiceAdd('d6')}>
                    D6
                </Button>
                <Button kind="secondary" onClick={handleDiceAdd('d8')} disabled>
                    D8
                </Button>
                <Button kind="secondary" onClick={handleDiceAdd('d10')} disabled>
                    D10
                </Button>
                <Button kind="secondary" onClick={handleDiceAdd('d12')}>
                    D12
                </Button>
                <Button kind="secondary" onClick={handleDiceAdd('d20')}>
                    D20
                </Button>
            </div>
        </>
    );
}
