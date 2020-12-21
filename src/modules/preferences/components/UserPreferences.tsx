import { Button, SIZE } from 'baseui/button';
import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader } from 'baseui/modal';
import { Tab, Tabs } from 'baseui/tabs-motion';
import React, { ReactText, useContext, useState } from 'react';
import { Preferences } from '../contexts/Preferences';
import { UserPreferencesContext } from '../contexts/UserPreferencesContext';
import { GeneralPreferences } from './GeneralPreferences';
import { RulerPreferences } from './RulerPreferences';

const SettingsIcon = () => (
    <svg viewBox="0 0 24 24" id="img__settings-24" xmlns="http://www.w3.org/2000/svg" width="24px" height="24px">
        <path
            fill="currentColor" fillRule="evenodd"
            d="M6 9.17V5a1 1 0 1 0-2 0v4.17a3.001 3.001 0 0 0 0 5.66V19a1 1 0 0 0 2 0v-4.17a3.001 3.001 0 0 0 0-5.66zm7 5V5a1 1 0 0 0-2 0v9.17a3.001 3.001 0 1 0 2 0zm7-4.34V19a1 1 0 0 1-2 0V9.83a3.001 3.001 0 1 1 2 0zM19 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-7 10a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm-7-5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
        />
    </svg>
);


export function UserPreferences() {
    const [ activeKey, setActiveKey ] = useState<ReactText>(0);
    const [ isOpen, setIsOpen ] = useState<boolean>(false);
    const { preferences, setPreferences } = useContext(UserPreferencesContext);
    const [ changedPreferences, setChangedPreferences ] = useState<Preferences>(preferences);

    const handleSavePreferences = () => {
        setPreferences(changedPreferences);

        setIsOpen(false);
    };

    return (
        <>
            <Button size={SIZE.compact} onClick={() => setIsOpen(true)} kind="secondary"><SettingsIcon /></Button>
            <Modal
                onClose={() => setIsOpen(false)}
                isOpen={isOpen}
                unstable_ModalBackdropScroll={true}
                overrides={{
                    Dialog: {
                        style: {
                            width: '80vw',
                            height: '80vh',
                            display: 'flex',
                            flexDirection: 'column'
                        }
                    }
                }}
            >
                <ModalHeader>User Preferences</ModalHeader>
                <ModalBody style={{ flex: '1 1 0' }}>
                    <Tabs
                        activeKey={activeKey}
                        onChange={({ activeKey }) => {
                            setActiveKey(activeKey);
                        }}
                        activateOnFocus
                    >
                        <Tab title="General">
                            <GeneralPreferences onPreferencesChange={setChangedPreferences} preferences={changedPreferences} />
                        </Tab>
                        <Tab title="Ruler">
                            <RulerPreferences onPreferencesChange={setChangedPreferences} preferences={changedPreferences} />
                        </Tab>
                        <Tab title="Misc">TBD</Tab>
                    </Tabs>
                </ModalBody>
                <ModalFooter>
                    <ModalButton kind="tertiary" onClick={() => setIsOpen(false)}>
                        Cancel
                    </ModalButton>
                    <ModalButton onClick={handleSavePreferences}>Save</ModalButton>
                </ModalFooter>
            </Modal>
        </>
    );
}
