import { Colors } from 'baseui/theme';
import { useContext } from 'react';
import { ColorsContext } from '../context/ColorsContext';

export function useColors(): Colors {
    const theme = useContext(ColorsContext);

    return theme.colors;
}
