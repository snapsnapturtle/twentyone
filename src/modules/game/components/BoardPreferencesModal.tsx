import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader } from 'baseui/modal';
import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../shared/axios';
import { Board } from '../context/CampaignContext';
import { useActiveBoard } from '../hooks/useActiveBoard';
import { BoardPreferencesForm } from './BoardPreferencesForm';

interface BoardPreferencesModalProps {
    isOpen: boolean;
    onClose: () => void
}

export function BoardPreferencesModal(props: BoardPreferencesModalProps) {
    const activeBoard = useActiveBoard();
    const [ showConfirmDeleteModal, setShowConfirmDeleteModal ] = useState<boolean>(false);
    const [ boardPreferences, setChangedBoard ] = useState<Omit<Board, 'id'>>(activeBoard);
    const [ loadingSave, setLoadingSave ] = useState<boolean>(false);
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

    const handleBoardPreferencesChange = (b: Omit<Board, 'id'>) => {
        setChangedBoard(b);
    };

    const handleSaveBoard = () => {
        if (loadingSave) {
            return;
        }

        setLoadingSave(true);

        axiosInstance.put(`/v1/boards/${activeBoard.id}`, {
            ...boardPreferences
        }).then(() => {
            props.onClose();
        }).finally(() => {
            setLoadingSave(false);
        });
    };

    const handleDeleteBoard = () => {
        if(loadingDelete) {
            return;
        }

        setLoadingDelete(true);

        axiosInstance.delete(`/v1/boards/${activeBoard.id}`).then(() => {
            setShowConfirmDeleteModal(false);
            props.onClose()
        }).finally(() => {
            setLoadingDelete(false)
        })
    };

    useEffect(() => {
        setChangedBoard(activeBoard);
    }, [ activeBoard ]);

    return (
        <>
            <Modal
                isOpen={props.isOpen}
                onClose={props.onClose}
                unstable_ModalBackdropScroll={true}
                overrides={{
                    Dialog: {
                        style: {
                            width: '40em',
                            display: 'flex',
                            flexDirection: 'column'
                        }
                    }
                }}
            >
                <ModalHeader>Board Preferences</ModalHeader>
                <ModalBody style={{ flex: '1 1 0' }}>
                    <BoardPreferencesForm board={boardPreferences} onChange={handleBoardPreferencesChange} />
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
                    <ModalButton onClick={handleSaveBoard} isLoading={loadingSave}>Save</ModalButton>
                </ModalFooter>
            </Modal>
            <Modal isOpen={showConfirmDeleteModal} onClose={() => setShowConfirmDeleteModal(false)} unstable_ModalBackdropScroll={true}>
                <ModalHeader>Confirm</ModalHeader>
                <ModalBody>
                    Do you want to delete the board?
                </ModalBody>
                <ModalFooter>
                    <ModalButton kind="tertiary" onClick={() => setShowConfirmDeleteModal(false)}>No</ModalButton>
                    <ModalButton onClick={handleDeleteBoard}>Yes</ModalButton>
                </ModalFooter>

            </Modal>
        </>
    );
}
