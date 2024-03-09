import './ChooseFolderModal.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';

function ChooseFolderNameModal(props) {

    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const updateFolderObject = (newFolder) => {
        const currentFolder = props.state.lastFolder;
        const updatedFolder = {
            ...currentFolder,
            folderName: newFolder,
        };
        props.setState((prevState) => ({ ...prevState, lastFolder: updatedFolder }))
    };

    const updateBookmarkObject = (newFolder) => {
        const currentBookmark = props.state.lastBookmark;
        const updatedBookmark = {
            ...currentBookmark,
            folderName: newFolder,
        };
        props.setState((prevState) => ({ ...prevState, lastBookmark: updatedBookmark }))
    };

    const updateOpenModal = (modalToOpen) => {
        props.setState((prevState) => ({ ...prevState, openModal: modalToOpen }))
        updateBookmarkObject(inputValue);
        updateFolderObject(inputValue);
    };

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
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                                <label className="form-check-label" htmlFor="flexRadioDefault1" />
                            </div>
                        </div>

                    </div>
                    <div className="bookmark-folder">
                        <div className="flex flex-col flex-1 justify-between p-4">
                            <img src="resources/folder.png" alt="folder img" loading="lazy" width="100vh" />
                            <section >
                                <h6 >Pattisserie</h6>
                            </section>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                                <label className="form-check-label" htmlFor="flexRadioDefault2" />
                            </div>
                        </div>
                    </div>
                    <div className="bookmark-folder">
                        <div className="flex flex-col flex-1 justify-between p-4">
                            <img src="resources/folder.png" alt="folder img" loading="lazy" width="100vh" />
                            <section>
                                <div className="input-group mb-3">
                                    <input type="text" className="form-control"
                                        value={inputValue}
                                        onChange={handleInputChange}
                                        placeholder="Type here your option" />
                                </div>
                            </section>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault3" />
                                <label className="form-check-label" htmlFor="flexRadioDefault3" />
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => { updateOpenModal('choose-folder-modal') }}>Back</Button>
                <Button variant="success" onClick={() => { updateOpenModal('choose-folder-location-modal') }}>Next</Button>
            </Modal.Footer>

        </Modal>

    );
}

export default ChooseFolderNameModal;