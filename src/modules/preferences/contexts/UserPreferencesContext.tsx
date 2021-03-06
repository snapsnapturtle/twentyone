import { createContext, Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { Preferences } from './Preferences';

const defaultPreferences: Preferences = {
    theme: 'auto',
    displayName: '',
    devicePixelRatio: 1,
    snapRulerToCenter: true,
    diceThrowStrength: 2
};

interface IUserPreferencesContext {
    preferences: Preferences;
    setPreferences: Dispatch<SetStateAction<Preferences>>;
}

export const UserPreferencesContext = createContext<IUserPreferencesContext>({
    preferences: defaultPreferences,
    setPreferences: () => {
    }
});


function loadStoredPreferences() {
    let localPreferences: Preferences = defaultPreferences;
    const preferencesString = localStorage.getItem('user-preferences');

    if (preferencesString !== null) {
        localPreferences = JSON.parse(preferencesString) as Preferences;
    }

    return localPreferences;
}

export const UserPreferencesContextProvider: FC = (props) => {
    const [ preferences, setPreferences ] = useState<Preferences>(loadStoredPreferences());

    useEffect(() => {
        localStorage.setItem('user-preferences', JSON.stringify(preferences));
    }, [ preferences ]);

    const context: IUserPreferencesContext = {
        preferences,
        setPreferences
    };

    return <UserPreferencesContext.Provider {...props} value={context} />;
};
