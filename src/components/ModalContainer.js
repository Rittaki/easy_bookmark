import React, { useState } from 'react';
import AskUserModal from './Modals/AskUserModal';
import ChooseFolderModal from './Modals/ChooseFolderModal';
import ChooseBookmarkNameModal from './Modals/ChooseBookmarkNameModal';
import ChooseFolderNameModal from './Modals/ChooseFolderNameModal';
import ChooseFolderLocationModal from './Modals/ChooseFolderLocationModal';

function ModalContainer(props) {
    const [modalOpen, setModalOpen] = useState('');

    const closeModal = () => {
        setModalOpen('');
    };

    return (
        <div onClick={openModal}>
        {modalOpen === 'ask-user-modal' && <AskUserModal closeModal={closeModal} />}
        {modalOpen === 'choose-folder-modal' && <ChooseFolderModal closeModal={closeModal} />}
        </div>
    );
}

export default ModalContainer;