import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';

function DeleteFolderModal(props) {

    return (

        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Delete a folder</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this folder?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={props.onHide}>
                    Yes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DeleteFolderModal;