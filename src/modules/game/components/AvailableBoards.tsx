import { useStyletron } from 'baseui';
import { Button } from 'baseui/button';
import { Drawer } from 'baseui/drawer';
import { ListItem, ListItemLabel } from 'baseui/list';
import { HeadingMedium, ParagraphMedium } from 'baseui/typography';
import React, { useContext, useState } from 'react';
import { CampaignContext } from '../context/CampaignContext';
import { BoardPreferencesModal } from './BoardPreferencesModal';
import { SwitchIcon } from './SwitchIcon';

export const AvailableBoards = () => {
    const [ css, theme ] = useStyletron();
    const [ isOpen, setIsOpen ] = useState<boolean>(false);
    const [ boardPreferencesOpen, setBoardPreferencesOpen ] = useState<boolean>(false);
    const { availableBoards, activeBoard, setActiveBoard } = useContext(CampaignContext);

    return (
        <>
            <div
                className={css({
                    position: 'absolute',
                    top: '2em',
                    right: '2em',
                    textAlign: 'center',
                    boxShadow: theme.lighting.shadow600,
                    background: theme.colors.backgroundTertiary,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center'
                })}
            >
                <ParagraphMedium as="div" paddingLeft="1em" paddingRight="1em">
                    <b>{activeBoard.name}</b>
                </ParagraphMedium>
                <Button size="compact" kind="secondary" onClick={() => setBoardPreferencesOpen(true)}>Edit</Button>
                <Button size="compact" onClick={() => setIsOpen(true)}>
                    <SwitchIcon />
                </Button>
            </div>
            <BoardPreferencesModal isOpen={boardPreferencesOpen} onClose={() => setBoardPreferencesOpen(false)} />
            <Drawer isOpen={isOpen} autoFocus={false} onClose={() => setIsOpen(false)}>
                <HeadingMedium>Campaign Boards</HeadingMedium>
                <ul className={css({ paddingLeft: 0, paddingRight: 0 })}>
                    {availableBoards.map(it => (
                        <ListItem
                            key={it.id}
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
                                    {activeBoard.id === it.id ? 'Current' : 'Open'}
                                </Button>
                            )}
                        >
                            <ListItemLabel>{it.name}</ListItemLabel>
                        </ListItem>))}
                </ul>
                <Button disabled>Create new board (tbd.)</Button>
            </Drawer>
        </>
    );
};
