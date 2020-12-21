import { Button } from 'baseui/button';
import { ButtonGroup } from 'baseui/button-group';
import { Checkbox } from 'baseui/checkbox';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import React, { Dispatch, SetStateAction } from 'react';
import { Preferences } from '../contexts/Preferences';

interface GeneralPreferencesProps {
    onPreferencesChange: Dispatch<SetStateAction<Preferences>>,
    preferences: Preferences
}

export function GeneralPreferences({ onPreferencesChange, preferences }: GeneralPreferencesProps) {
    const highResolution = preferences.devicePixelRatio > 1;

    const handleChange = (partialPreferences: Partial<Preferences>) =>
        onPreferencesChange(current => ({ ...current, ...partialPreferences }));

    const availableThemes = [ 'light', 'dark', 'auto' ];

    return (
        <>
            <FormControl label="Appearance">
                <ButtonGroup selected={availableThemes.indexOf(preferences.theme)}>
                    {availableThemes.map(it =>
                        <Button key={it} onClick={() => handleChange({ theme: it as 'light' | 'dark' | 'auto' })}>
                            {it.charAt(0).toUpperCase() + it.slice(1)}
                        </Button>
                    )}
                </ButtonGroup>
            </FormControl>
            <FormControl label="Display Name">
                <Input value={preferences.displayName} onChange={(e: any) => handleChange({ displayName: e.target.value })} />
            </FormControl>
            <FormControl label="Render options">
                <Checkbox
                    checked={highResolution}
                    onChange={(e: any) => handleChange({ devicePixelRatio: e.target.checked ? window.devicePixelRatio : 1 })}
                    disabled={window.devicePixelRatio === 1}
                >
                    Use high resolution rendering
                </Checkbox>
            </FormControl>
        </>
    );
}
