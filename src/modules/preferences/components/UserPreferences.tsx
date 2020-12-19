import { Button, SIZE } from 'baseui/button';
import { ButtonGroup } from 'baseui/button-group';
import { Checkbox } from 'baseui/checkbox';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader } from 'baseui/modal';
import React, { useContext, useState } from 'react';
import { UserPreferencesContext } from '../contexts/UserPreferencesContext';

const SettingsIcon = () => (
    <svg viewBox="0 0 24 24" id="img__settings-24" xmlns="http://www.w3.org/2000/svg" width="24px" height="24px">
        <path
            fill="currentColor" fillRule="evenodd"
            d="M6 9.17V5a1 1 0 1 0-2 0v4.17a3.001 3.001 0 0 0 0 5.66V19a1 1 0 0 0 2 0v-4.17a3.001 3.001 0 0 0 0-5.66zm7 5V5a1 1 0 0 0-2 0v9.17a3.001 3.001 0 1 0 2 0zm7-4.34V19a1 1 0 0 1-2 0V9.83a3.001 3.001 0 1 1 2 0zM19 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-7 10a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm-7-5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
        />
    </svg>
);


export function UserPreferences() {
    const [ isOpen, setIsOpen ] = useState<boolean>(false);
    const { preferences, setPreferences } = useContext(UserPreferencesContext);
    const [ theme, setTheme ] = useState<'light' | 'dark' | 'auto'>(preferences.theme);
    const [ displayName, setDisplayName ] = useState<string>(preferences.displayName);

    const [ useHighResolution, setUseHighResolution ] = useState<boolean>(preferences.devicePixelRatio === window.devicePixelRatio);

    const handleSavePreferences = () => {
        setPreferences({
            devicePixelRatio: useHighResolution ? window.devicePixelRatio : 1,
            theme,
            displayName
        });

        setIsOpen(false);
    };

    const availableThemes = [ 'light', 'dark', 'auto' ];

    return (
        <>
            <Button size={SIZE.compact} onClick={() => setIsOpen(true)} kind="secondary"><SettingsIcon /></Button>
            <Modal onClose={() => setIsOpen(false)} isOpen={isOpen} unstable_ModalBackdropScroll={true}>
                <ModalHeader>User Preferences</ModalHeader>
                <ModalBody>
                    <FormControl label="Appearance">
                        <ButtonGroup selected={availableThemes.indexOf(theme)}>
                            {availableThemes.map(it => <Button key={it} onClick={() => setTheme(it as any)}>{it.toUpperCase()}</Button>)}
                        </ButtonGroup>
                    </FormControl>
                    <FormControl label="Display Name" caption="Your out-of-character name">
                        <Input value={displayName} onChange={(e: any) => setDisplayName(e.target.value)} />
                    </FormControl>
                    <FormControl label="Render option">
                        <Checkbox
                            checked={useHighResolution}
                            onChange={(e: any) => setUseHighResolution(e.target.checked)}
                            disabled={window.devicePixelRatio === 1}
                        >
                            Use high resolution rendering
                        </Checkbox>
                    </FormControl>
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
