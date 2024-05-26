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

    const updateBookmarkObject = (newFolder) => {
        const currentBookmark = props.state.lastBookmark;
        const updatedBookmark = {
            ...currentBookmark,
            folder: newFolder,
        };
        props.setState((prevState) => ({ ...prevState, lastBookmark: updatedBookmark }))
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
                <Button variant="secondary" onClick={() => {
                    props.state.chooseExistingFolder ? updateOpenModal('choose-folder-modal') : updateOpenModal('choose-folder-name-modal');
                }}>Back</Button>
                <Button variant="success" onClick={() => {
                    if (props.state.chooseExistingFolder) {
                        props.setState((prevState) => ({ ...prevState, openModal: 'choose-bookmark-name-modal', isAnotherFolder: false }));
                        updateBookmarkObject(props.state.currentClickedLocationFolder)
                    } else {
                        props.setState((prevState) => ({ ...prevState, openModal: 'choose-bookmark-name-modal', isAnotherFolder: true }));
                        updateFolderObject(props.state.currentClickedLocationFolder)
                    }
                    // props.state.chooseExistingFolder ? updateBookmarkObject(props.state.currentClickedLocationFolder) : updateFolderObject(props.state.currentClickedLocationFolder);
                    // updateFolderObject(props.state.currentClickedLocationFolder);
                }}>Next</Button>
            </Modal.Footer>

        </Modal>

    );
}

export default ChooseFolderLocationModal;