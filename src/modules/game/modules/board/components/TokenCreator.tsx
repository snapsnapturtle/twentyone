import { Button, SIZE } from 'baseui/button';
import { FileUploader } from 'baseui/file-uploader';
import { FormControl } from 'baseui/form-control';
import { Plus } from 'baseui/icon';
import { Input } from 'baseui/input';
import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader } from 'baseui/modal';
import React, { useState } from 'react';
import { axiosInstance } from '../../../../../shared/axios';

export function TokenCreator() {
    const [ showModal, setShowModal ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState<boolean>(false);

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();

        if (loading) {
            return;
        }

        setLoading(true);

        axiosInstance.post('/v1/sessions/h8xns1pym/tokens', {
            name: 'goblin-1',
            position: {
                x: 0,
                y: 0
            }
        }).then(() => {
            setShowModal(false);
        }).catch(() => {
            setLoading(false);
            alert('something went wrong :(');
        });
    };

    return (
        <>
            <Button size={SIZE.compact} kind="secondary" onClick={() => setShowModal(true)}>
                <Plus size={20} />
            </Button>
            <Modal onClose={() => setShowModal(false)} isOpen={showModal}>
                <form onSubmit={handleCreate}>
                    <ModalHeader>Create a new Token</ModalHeader>
                    <ModalBody>
                        <FormControl label="Name">
                            <Input name="name" />
                        </FormControl>
                        <FormControl label="Token">
                            <FileUploader />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <ModalButton kind="tertiary" type="button" onClick={() => setShowModal(false)}>
                            Cancel
                        </ModalButton>
                        <ModalButton type="submit">Create</ModalButton>
                    </ModalFooter>
                </form>
            </Modal>
        </>
    );
}
