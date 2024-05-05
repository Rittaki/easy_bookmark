import './ChooseFolderModal.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';

function ChooseFolderModal(props) {

    const updateOpenModal = (modalToOpen) => {
        props.setState((prevState) => ({ ...prevState, openModal: modalToOpen }))
    }

    return (

        <Modal className="modal-window" show={props.show} onHide={props.onHide}>

            <Modal.Header closeButton>
                <Modal.Title>Choose a folder</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>Please choose the most suitable folder</p>
                <div className="folders-container">
                    <div className="bookmark-folder">
                        <div className="flex flex-col flex-1 justify-between p-4">
                            <img src="resources/folder.png" alt="folder img" loading="lazy" width="100vh" />
                            <section >
                                <h6 >Drinks</h6>
                                <p >10 links</p>
                            </section>
                        </div>
                    </div>
                    <div className="bookmark-folder">
                        <div className="flex flex-col flex-1 justify-between p-4">
                            <img src="resources/folder.png" alt="folder img" loading="lazy" width="100vh" />
                            <section >
                                <h6 >Pattisserie</h6>
                                <p >15 links</p>
                            </section>
                        </div>
                    </div>
                    <div className="bookmark-folder">
                        <div className="flex flex-col flex-1 justify-between p-4">
                            <img src="resources/folder.png" alt="folder img" loading="lazy" width="100vh" />
                            <section >
                                <h6 className='opacity-50'>Create new folder...</h6>
                                <Button variant="info" onClick={() => { updateOpenModal('choose-folder-name-modal') }}>Click</Button>
                            </section>
                        </div>
                    </div>
                </div>
                <p>Want to choose another existing folder? Click <span className='fw-semibold'>here</span></p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => { updateOpenModal('ask-user-modal') }}>Back</Button>
                <Button variant="success" onClick={() => {
                    props.setState((prevState) => ({ ...prevState, openModal: 'choose-bookmark-name-modal', isAnotherFolder: false }))
                }}>Next</Button>
            </Modal.Footer>

        </Modal>

    );
}

export default ChooseFolderModal;