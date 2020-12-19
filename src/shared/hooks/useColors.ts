import { useStyletron } from 'baseui';
import { Colors } from 'baseui/theme';

export function useColors(): Colors {
    const theme = useStyletron()[ 1 ];

    return theme.colors;
}
