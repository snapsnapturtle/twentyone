import { useStyletron } from 'baseui';
import { Button } from 'baseui/button';
import { Drawer } from 'baseui/drawer';
import { ListItem, ListItemLabel } from 'baseui/list';
import { HeadingMedium } from 'baseui/typography';
import React, { useContext, useState } from 'react';
import { SessionContext } from '../context/SessionContext';

export const AvailableBoardsList = () => {
    const [ css ] = useStyletron();
    const [ isOpen, setIsOpen ] = useState<boolean>(true);
    const { availableBoards, activeBoard, setActiveBoard } = useContext(SessionContext);
    return (
        <Drawer isOpen={isOpen} autoFocus={false} onClose={() => setIsOpen(false)}>
            <HeadingMedium>Campaign Boards</HeadingMedium>
            <ul className={css({ paddingLeft: 0, paddingRight: 0 })}>
                {availableBoards.map(it => (
                    <ListItem
                        endEnhancer={() => (
                            <Button
                                size="compact"
                                kind="secondary"
                                shape="pill"
                                disabled={activeBoard.id === it.id}
                                onClick={() => {
                                    setActiveBoard(it);
                                    setIsOpen(false);
                                }}
                            >
                                {activeBoard.id === it.id ? 'Active' : 'Open'}
                            </Button>
                        )}
                    >
                        <ListItemLabel description={it.id === 2 ? 'All players' : null}>{it.name}</ListItemLabel>
                    </ListItem>))}
            </ul>
            <Button disabled>Create new board (tbd.)</Button>
        </Drawer>
    );
};
