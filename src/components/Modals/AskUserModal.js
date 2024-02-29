import './AskUserModal.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';
import ChooseFolderModal from './ChooseFolderModal';

function AskUserModal(props) {
    // const [modalOpen, setModalOpen] = useState('');
    const [showFolderModal, setShowFolderModal] = useState(false);

    // const handleNext = () => {
    //     setShowFolderModal(true);
    //     props.onHide(true)
    //   };

    return (
        
        <Modal className="modal-window" show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>New Bookmark</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>You are going to save this url as a new bookmark. Press "Next" if you want to proceed</p>
                <div className="folders-container">
                    <label htmlFor="urlInput" />
                    <input type="text" readOnly className="rounded-3" id="urlInput" value={props.state.currentUrl} />
                    <span id="currentUrl"></span>

                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>Close</Button>
                <Button variant="success" onClick={() => {props.setState((prevState) => ({ ...prevState, openModal: 'choose-folder-modal' }))}}>Next</Button> {// onClick will navigate to the next modal in the flow
                }
                {/*<ChooseFolderModal show={props.state.openModal === 'choose-folder-modal'} onHide={props.onHide} setState={props.setState} state={props.state}/>*/}
                {/*{showFolderModal && <ChooseFolderModal show={showFolderModal} closeModal={false} />}*/}
            </Modal.Footer>
        </Modal>
    );
}

export default AskUserModal;