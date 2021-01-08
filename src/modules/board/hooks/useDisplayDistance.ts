import { useUserPreferences } from '../../preferences/hooks/useUserPreferences';

export function useDisplayDistance() {
    const preferences = useUserPreferences();

    return (rawDistance: number) => {
        return `${rawDistance * 5}&nbsp;ft\n${rawDistance}&nbsp;sq`
    }
}
