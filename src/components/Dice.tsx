import { Button } from 'baseui/button';
import { Notification } from 'baseui/notification';
import React, { useEffect, useState } from 'react';
import { connection } from '../shared/connection';

export const Dice = () => {
    const [ diceResult, setDiceResult ] = useState<{ dice: { type: string, result: string }[], totalResult: string }>();

    useEffect(() => {
        // @ts-ignore
        connection.on('dice_change', (res) => setDiceResult(res));

        return () => {
            connection.off('dice_change');
        };
    }, []);

    return (
        <div>
            <Notification>{JSON.stringify(diceResult, null, 2)}</Notification>
            <Button onClick={() => connection.emit('roll_dice', { dice: [] })}>Roll Dice</Button>
        </div>
    );
};
