import { Modal, ModalBody, ModalHeader } from 'baseui/modal';
import { Table } from 'baseui/table';
import React, { useState } from 'react';

export function ShortcutInformationModal() {
    const [ isOpen, setIsOpen ] = useState(false);

    const columns = [ 'Combination', 'Description' ];
    const shortcutsData = [
        [ <kbd>v</kbd>, 'Normal Mouse' ],
        [ <kbd>r</kbd>, 'Select polyline ruler' ],
        [ <kbd>c</kbd>, 'Select circle ruler' ]
    ];

    return (
        <Modal
            onClose={() => setIsOpen(false)}
            isOpen={isOpen}
            unstable_ModalBackdropScroll={true}
            overrides={{
                Dialog: {
                    style: {
                        width: '50em',
                        height: '70vh',
                        display: 'flex',
                        flexDirection: 'column'
                    }
                }
            }}
        >
            <ModalHeader>Shortcuts</ModalHeader>
            <ModalBody style={{ flex: '1 1 0' }}>
                <Table columns={columns} data={shortcutsData} />
            </ModalBody>
        </Modal>
    );
}
