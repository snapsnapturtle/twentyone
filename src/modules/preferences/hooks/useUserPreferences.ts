import { useContext } from 'react';
import { Preferences } from '../contexts/Preferences';
import { UserPreferencesContext } from '../contexts/UserPreferencesContext';

export function useUserPreferences(): Preferences {
    const { preferences } = useContext(UserPreferencesContext);

    return preferences;
}
