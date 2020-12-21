import { Checkbox } from 'baseui/checkbox';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import React, { Dispatch, SetStateAction } from 'react';
import { Preferences } from '../contexts/Preferences';

interface RulerPreferencesProps {
    onPreferencesChange: Dispatch<SetStateAction<Preferences>>,
    preferences: Preferences
}

export function RulerPreferences({ onPreferencesChange, preferences }: RulerPreferencesProps) {
    const handleChange = (partialPreferences: Partial<Preferences>) =>
        onPreferencesChange(current => ({ ...current, ...partialPreferences }));

    return (
        <>
            <FormControl>
                <Checkbox checked={preferences.snapRulerToCenter} onChange={(e: any) => handleChange({ snapRulerToCenter: e.target.checked })}>
                    Snap to center
                </Checkbox>

            </FormControl>
            <FormControl label="Distance">
                <Input placeholder="tile size = 1   " />
            </FormControl>
            <FormControl>
                <Input placeholder="feet" />
            </FormControl>
        </>
    );
}
