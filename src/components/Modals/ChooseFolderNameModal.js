import './ChooseFolderModal.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';

function ChooseFolderNameModal(props) {
    return (

        <Modal className="modal-window" show={props.show} onHide={props.onHide}>

            <Modal.Header closeButton>
                <Modal.Title>How do you want to name a folder?</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>Please choose the most suitable folder</p>
                <div className="folders-container">
                    <div className="bookmark-folder">
                        <div className="flex flex-col flex-1 justify-between p-4">
                            <img src="resources/folder.png" alt="folder img" loading="lazy" width="100vh" />
                            <section >
                                <h6 >Drinks</h6>
                            </section>
                        </div>
                    </div>
                    <div className="bookmark-folder">
                        <div className="flex flex-col flex-1 justify-between p-4">
                            <img src="resources/folder.png" alt="folder img" loading="lazy" width="100vh" />
                            <section >
                                <h6 >Pattisserie</h6>
                            </section>
                        </div>
                    </div>
                    <div className="bookmark-folder">
                        <div className="flex flex-col flex-1 justify-between p-4">
                            <img src="resources/folder.png" alt="folder img" loading="lazy" width="100vh" />
                            <section >
                                <h6 >Type here your option</h6>
                            </section>
                        </div>
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => {props.setState((prevState) => ({ ...prevState, openModal: 'choose-folder-modal' }))}}>Back</Button>
                <Button variant="success" onClick={() => {props.setState((prevState) => ({ ...prevState, openModal: 'choose-folder-location-modal' }))}}>Next</Button> {//// onClick will navigate to the next modal in the flow
                }
            </Modal.Footer>

        </Modal>

    );
}

export default ChooseFolderNameModal;