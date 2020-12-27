import { useStyletron } from 'baseui';
import React, { FC } from 'react';

export const Main: FC = (props) => {
    const [ css, theme ] = useStyletron();

    return (
        <div
            {...props}
            className={css({
                background: theme.colors.backgroundPrimary,
                width: '100%',
                boxSizing: 'border-box',
                height: '100vh'
            })}
        />
    );
};
