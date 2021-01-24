import { useStyletron } from 'baseui';
import { Button } from 'baseui/button';
import React, { FC } from 'react';

interface DiceButtonProps {
    onClick: (e: React.MouseEvent) => void,
    selectedDice: number;
    diceName: string;
}

const SelectedDiceCount: FC = (props) => {
    const [ css, theme ] = useStyletron();

    return <span
        className={css({
            position: 'absolute',
            bottom: '-2em',
            left: '50%',
            width: '1.5em',
            height: '1.5em',
            lineHeight: '1.5em',
            borderRadius: '50%',
            transform: 'translateX(-50%)',
            fontSize: '0.75em',
            color: theme.colors.contentOnColor,
            backgroundColor: theme.colors.backgroundAccent,
        })} {...props} />;
};

export const DiceButton: FC<DiceButtonProps> = (props) => {
    const [ css ] = useStyletron();
    return (
        <Button kind="secondary" onClick={props.onClick}>
            <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                {props.children}
                <span className={css({ textAlign: 'center', fontSize: '0.75em', marginTop: '0.375em', marginBottom: '-0.5em' })}>{props.diceName}</span>
                {props.selectedDice > 0 && <SelectedDiceCount>{props.selectedDice}</SelectedDiceCount>}
            </div>
        </Button>
    );
};
