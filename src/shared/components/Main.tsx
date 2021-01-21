import { useStyletron } from 'baseui';
import React, { FC } from 'react';

export const Main: FC = (props) => {
    const [ css, theme ] = useStyletron();

    return (
        <div
            {...props}
            className={css({
                background: theme.colors.backgroundSecondary,
                width: '100%',
                boxSizing: 'content-box',
                height: '100vh'
            })}
        />
    );
};
