import './ChooseFolderLocationModal.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import FolderLocationNav from './FolderLocationNav/FolderLocationNav';

function ChooseFolderLocationModal(props) {
    // add function that updates parent folder
    const updateFolderObject = (newFolder) => {
        const currentFolder = props.state.lastFolder;
        const updatedFolder = {
            ...currentFolder,
            parentFolder: newFolder,
        };
        props.setState((prevState) => ({ ...prevState, lastFolder: updatedFolder }))
    };

    const updateOpenModal = (modalToOpen) => {
        props.setState((prevState) => ({ ...prevState, openModal: modalToOpen }))
    }
    return (

        <Modal className="modal-window" show={props.show} onHide={props.onHide}>

            <Modal.Header closeButton>
                <Modal.Title>Where do you want to put a folder?</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>Please choose a location:</p>
                <FolderLocationNav setState={props.setState} state={props.state} />
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => { updateOpenModal('choose-folder-name-modal') }}>Back</Button>
                <Button variant="success" onClick={() => {
                    props.setState((prevState) => ({ ...prevState, openModal: 'choose-bookmark-name-modal', isAnotherFolder: true }));
                    updateFolderObject(props.state.currentClickedLocationFolder);
                }}>Next</Button>
            </Modal.Footer>

        </Modal>

    );
}

export default ChooseFolderLocationModal;