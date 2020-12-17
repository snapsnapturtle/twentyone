import { useStyletron } from 'baseui';
import React, { FC } from 'react';

export const Sidebar: FC = (props) => {
    const [ css, theme ] = useStyletron();

    return (
        <div
            {...props}
            className={css({
                background: theme.colors.background,
                width: '20em',
                height: '100vh',
                boxSizing: 'border-box',
                paddingLeft: theme.sizing.scale500,
                paddingRight: theme.sizing.scale500,
                boxShadow: theme.lighting.shadow500
            })}
        />
    );
};
