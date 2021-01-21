import { useStyletron } from 'baseui';
import { FormControl } from 'baseui/form-control';
import { Slider } from 'baseui/slider';
import React, { Dispatch, SetStateAction } from 'react';
import { Preferences } from '../contexts/Preferences';

interface ThrowStrengthProps {
    diceThrowStrength: number,
    setDiceThrowStrength: (strength: number) => void
}

function ThrowStrength({ diceThrowStrength, setDiceThrowStrength }: ThrowStrengthProps) {
    const [ css, theme ] = useStyletron();

    console.log(diceThrowStrength)

    const value = [ diceThrowStrength ];
    const setValue = (newValue: number[]) => setDiceThrowStrength(newValue[ 0 ]);

    return (
        <Slider
            value={value}
            min={1}
            max={3}
            step={1}
            marks
            onChange={({ value }) => setValue(value)}
            overrides={{
                Root: {
                    style: {
                        width: '50%'
                    }
                },
                InnerThumb: () => null,
                ThumbValue: () => null,
                TickBar: () => (
                    <div
                        className={css({
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingRight: theme.sizing.scale600,
                            paddingLeft: theme.sizing.scale600,
                            paddingBottom: theme.sizing.scale400
                        })}
                    >
                        <div>Weak</div>
                        <div>Normal</div>
                        <div>Angry</div>
                    </div>
                )
            }}
        />
    );
}


interface DicePreferencesProps {
    onPreferencesChange: Dispatch<SetStateAction<Preferences>>,
    preferences: Preferences
}

export function DicePreferences({ onPreferencesChange, preferences }: DicePreferencesProps) {
    const handleChange = (partialPreferences: Partial<Preferences>) =>
        onPreferencesChange(current => ({ ...current, ...partialPreferences }));

    return (
        <>
            <FormControl label="Throw Strength">
                <ThrowStrength diceThrowStrength={preferences.diceThrowStrength || 2} setDiceThrowStrength={strength => handleChange({diceThrowStrength: strength})} />
            </FormControl>
        </>
    );
}
