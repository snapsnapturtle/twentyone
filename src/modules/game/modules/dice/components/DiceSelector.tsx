import { useStyletron } from 'baseui';
import { Button } from 'baseui/button';
import { ArrowRight } from 'baseui/icon';
import React, { useState } from 'react';
import { animated, config, useSpring } from 'react-spring';
import { useActiveDiceStore } from '../../../hooks/useActiveDiceStore';
import { DiceType } from '../hooks/useCreateDice';
import { DiceButton } from './DiceButton';
import { DiceD10Icon } from './icons/DiceD10Icon';
import { DiceD12Icon } from './icons/DiceD12Icon';
import { DiceD20Icon } from './icons/DiceD20Icon';
import { DiceD4Icon } from './icons/DiceD4Icon';
import { DiceD6Icon } from './icons/DiceD6Icon';
import { DiceD8Icon } from './icons/DiceD8Icon';

export function DiceSelector() {
    const [ css, theme ] = useStyletron();
    const [ selectedDice, setSelectedDice ] = useState<DiceType[]>([]);
    const setDice = useActiveDiceStore(state => state.setDice);

    const [ style, set ] = useSpring(() => ({
        bottom: 2,
        opacity: 0,
        config: config.stiff
    }));

    const handleDiceAdd = (diceType: DiceType) => () => {
        setSelectedDice(current => current.concat([ diceType ]));
        set({ bottom: 7, opacity: 1 });
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

    const handleClearClick = () => {
        setSelectedDice([]);
        set({ bottom: 2, opacity: 0 });
    };

    return (
        <>
            <animated.div
                className={css({
                    position: 'absolute',
                    left: 'calc(50%)',
                    bottom: '6em',
                    transform: 'translateX(-50%)',
                })}
                style={{
                    opacity: style.opacity,
                    bottom: style.bottom.interpolate(b => `${b}em`)
                }}
            >
                <Button kind="secondary" onClick={handleClearClick} overrides={{ Root: { style: { marginRight: theme.sizing.scale400} } }}>
                    Cancel
                </Button>
                <Button onClick={handleRollClick}>Roll Dice</Button>
            </animated.div>

            <div
                className={css({
                    position: 'absolute',
                    bottom: '2em',
                    left: 'calc(50%)',
                    transform: 'translateX(-50%)',
                    textAlign: 'center',
                    boxShadow: theme.lighting.shadow600,
                    background: theme.colors.backgroundTertiary
                })}
            >
                <DiceButton
                    onClick={handleDiceAdd('d4')}
                    selectedDice={selectedDice.filter(it => it === 'd4').length}
                    diceName="D4"
                >
                    <DiceD4Icon />
                </DiceButton>
                <DiceButton
                    onClick={handleDiceAdd('d6')}
                    selectedDice={selectedDice.filter(it => it === 'd6').length}
                    diceName="D6"
                >
                    <DiceD6Icon />
                </DiceButton>
                <DiceButton
                    onClick={handleDiceAdd('d8')}
                    selectedDice={selectedDice.filter(it => it === 'd8').length}
                    diceName="D8"
                >
                    <DiceD8Icon />
                </DiceButton>
                <DiceButton
                    onClick={handleDiceAdd('d10')}
                    selectedDice={selectedDice.filter(it => it === 'd10').length}
                    diceName="D10"
                >
                    <DiceD10Icon />
                </DiceButton>
                <DiceButton
                    onClick={handleDiceAdd('d12')}
                    selectedDice={selectedDice.filter(it => it === 'd12').length}
                    diceName="D12"
                >
                    <DiceD12Icon />
                </DiceButton>
                <DiceButton
                    onClick={handleDiceAdd('d20')}
                    selectedDice={selectedDice.filter(it => it === 'd20').length}
                    diceName="D20"
                >
                    <DiceD20Icon />
                </DiceButton>
            </div>
        </>
    );
}
