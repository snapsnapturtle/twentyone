import { useStyletron } from 'baseui';
import { Theme } from 'baseui/theme';
import { createContext, FC } from 'react';

export const ColorsContext = createContext<Theme>({} as Theme);

export const ColorsContextProvider: FC = props => {
    const context: Theme = useStyletron()[ 1 ];
    return <ColorsContext.Provider {...props} value={context} />;
};
