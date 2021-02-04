import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader } from 'baseui/modal';
import React, { useState } from 'react';
import { BoardPreferencesForm } from './BoardPreferencesForm';

interface BoardPreferencesModalProps {
    isOpen: boolean;
    onClose: () => void
}

export function BoardPreferencesModal(props: BoardPreferencesModalProps) {
    const [ showConfirmDeleteModal, setShowConfirmDeleteModal ] = useState<boolean>(false);

    return (
        <>
            <Modal
                isOpen={props.isOpen}
                onClose={props.onClose}
                unstable_ModalBackdropScroll={true}
                overrides={{
                    Dialog: {
                        style: {
                            display: 'flex',
                            flexDirection: 'column'
                        }
                    }
                }}
            >
                <ModalHeader>Board Preferences</ModalHeader>
                <ModalBody style={{ flex: '1 1 0' }}>
                    <BoardPreferencesForm />
                </ModalBody>
                <ModalFooter>
                    <ModalButton
                        kind="tertiary"
                        overrides={{ BaseButton: { style: { float: 'left', clear: 'both' } } }}
                        onClick={() => setShowConfirmDeleteModal(true)}
                    >
                        Delete Board
                    </ModalButton>
                    <ModalButton kind="tertiary" onClick={props.onClose}>Cancel</ModalButton>
                    <ModalButton>Save</ModalButton>
                </ModalFooter>
            </Modal>
            <Modal isOpen={showConfirmDeleteModal} onClose={() => setShowConfirmDeleteModal(false)} unstable_ModalBackdropScroll={true}>
                <ModalHeader>Confirm</ModalHeader>
                <ModalBody>
                    Do you want to delete the board?
                </ModalBody>
                <ModalFooter>
                    <ModalButton kind="tertiary" onClick={() => setShowConfirmDeleteModal(false)}>No</ModalButton>
                    <ModalButton onClick={() => alert('Implement: delete board')}>Yes</ModalButton>
                </ModalFooter>

            </Modal>
        </>
    );
}
