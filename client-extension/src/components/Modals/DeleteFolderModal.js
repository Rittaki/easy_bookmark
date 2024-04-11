import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';

function DeleteModal(props) {
    const handleDeleteFolder = () => {
        chrome.runtime.sendMessage({
            action: "deleteFolder",
            folder: props.state.folderToDelete,
        }, (response) => {
            if (response.success) {
                console.log("Folder deleted successfully (from react)");
                props.setState((prevState) => ({ ...prevState, reloadAfterDelete: !props.state.reloadAfterDelete }));
            };
        });
        props.onHide();
    };

    const handleDeleteBookmark = () => {
        chrome.runtime.sendMessage({
            action: "deleteBookmark",
            bookmark: props.state.bookmarkToDelete,
        }, (response) => {
            if (response.success) {
                console.log("Bookmark deleted successfully (from react)");
                props.setState((prevState) => ({ ...prevState, reloadAfterDelete: !props.state.reloadAfterDelete }));
            };
        });
        props.onHide();
    };

    return (
        props.state.folderToDelete ? (
            <Modal show={props.show} onHide={props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete a folder</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this folder? {props.state.folderToDelete}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.onHide}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleDeleteFolder}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        ) : props.state.bookmarkToDelete ? (
            <Modal show={props.show} onHide={props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete a bookmark</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this bookmark? {props.state.bookmarkToDelete}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.onHide}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleDeleteBookmark}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        ) : (
            <Modal show={props.show} onHide={props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete a folder</Modal.Title>
                </Modal.Header>
                <Modal.Body>You didn't choose any folder/bookmark to delete {props.state.folderToDelete}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.onHide}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    );
}

export default DeleteModal;