import { Button, SIZE } from 'baseui/button';
import { FileUploader } from 'baseui/file-uploader';
import { Plus } from 'baseui/icon';
import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader } from 'baseui/modal';
import { ParagraphMedium } from 'baseui/typography';
import React, { useState } from 'react';
import { connection } from '../../../../shared/connection';

export function TokenCreator() {
    const [ showModal, setShowModal ] = useState<boolean>(false);

    const handleCreate = () => {
        connection.emit('add_position', { id: Math.random().toString(), x: 0, y: 0 });

        setShowModal(false);
    };

    return (
        <>
            <Button size={SIZE.compact} kind="secondary" onClick={() => setShowModal(true)}>
                <Plus size={20} />
            </Button>
            <Modal onClose={() => setShowModal(false)} isOpen={showModal}>
                <ModalHeader>Create a new Token</ModalHeader>
                <ModalBody>
                    <ParagraphMedium>
                        Proin ut dui sed metus pharetra hend rerit vel non mi.
                        Nulla ornare faucibus ex, non facilisis nisl. Maecenas
                        aliquet mauris ut tempus.
                    </ParagraphMedium>
                    <FileUploader />
                </ModalBody>
                <ModalFooter>
                    <ModalButton kind="tertiary" onClick={() => setShowModal(false)}>
                        Cancel
                    </ModalButton>
                    <ModalButton onClick={handleCreate}>Save</ModalButton>
                </ModalFooter>
            </Modal>
        </>
    );
}
