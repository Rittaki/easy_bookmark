import './ChooseFolderNameModal.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';

function ChooseFolderNameModal(props) {
    const [chosenFolderName, setChosenFolderName] = useState("");
    const [folderNames, setFolderNames] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState(null); // handle error later, after handling set to null again

    // handle otherInput 
    const [otherSelected, setOtherSelected] = useState(false);

    useEffect(() => {
        if (props.show && (!folderNames.length)) {
            // if array of names is empty, fetch, if not - not fetch. Make array empty when onHide and when save
            console.log("inside 'useEffect' method in choose folder name modal", props.show, "names are empty:", folderNames);
            setFolderNames(["First", "Second", "Third"]);
            // chrome.runtime.sendMessage({
            //     action: "generateFolders",
            //     url: props.state.lastBookmark.url
            // }, (response) => {
            //     if (response.success) {
            //         console.log('Folders fetched (message from client)', response);
            //         setFolderNames(response.success.folder_names);
            //         setError(null);
            //     }
            //     else {
            //         setError(json.error);
            //     };
            // });
        }
    }, [props.show]);

    const handleInputChange = (e) => {
        console.log(e.target.value);
        setInputValue(e.target.value);
        setChosenFolderName(e.target.value);
    };

    const handleChange = (e) => {
        console.log(e.target.value);
        setChosenFolderName(e.target.value);
    };

    const updateFolderObject = (newFolder) => {
        const currentFolder = props.state.lastFolder;
        const updatedFolder = {
            ...currentFolder,
            name: newFolder,
        };
        props.setState((prevState) => ({ ...prevState, lastFolder: updatedFolder }));
        setInputValue("");
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
        updateBookmarkObject(chosenFolderName);
        updateFolderObject(chosenFolderName);
        setInputValue("");
        setOtherSelected(false);
    };

    const closeModal = () => {
        props.onHide();
        setFolderNames([]);
        setInputValue("");
        setOtherSelected(false);
    };

    return (

        <Modal className="modal-window" show={props.show} onHide={closeModal}>

            <Modal.Header closeButton>
                <Modal.Title>How do you want to name a folder?</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>Please choose the most suitable folder name</p>
                {
                    folderNames.length ?
                        <div className="folders-container">
                            {folderNames.length && folderNames.map((folderName, index) => (
                                <div key={index} className="bookmark-folder">
                                    <label className="form-check-label" htmlFor={`folderGroupRadioGrid${index}`} onClick={() => setOtherSelected(false)}>
                                        <div className="flex flex-col flex-1 justify-between new-folder p-2">
                                            <img src="resources/folder.png" alt="folder img" loading="lazy" width="100vh" />
                                            <section >
                                                <strong className="fw-semibold text-truncate d-inline-block" style={{ maxWidth: '100%' }}>{folderName}</strong>

                                            </section>
                                            <input className="form-check-input" type="radio" name="folderGroupRadioGrid"
                                                id={`folderGroupRadioGrid${index}`}
                                                value={folderName} defaultChecked=""
                                                onChange={handleChange} />
                                        </div>
                                    </label>
                                </div>
                            ))}

                            <div className="bookmark-folder">
                                <label className="form-check-label" htmlFor='folderGroupRadioGrid4' onClick={() => setOtherSelected(true)}>
                                    <div className="flex flex-col flex-1 justify-between new-folder p-2">
                                        <img src="resources/folder.png" alt="folder img" loading="lazy" width="100vh" />
                                        <section style={{ height: "30px" }}>
                                            {otherSelected ?
                                                <div className="input-group">
                                                    <input type="text" className="fw-semibold text-truncate d-inline-block"
                                                        id="otherInput"
                                                        value={inputValue}
                                                        onChange={handleInputChange}
                                                        placeholder="Type here your option" />
                                                </div>
                                                : <strong className="fw-semibold opacity-25 text-truncate d-inline-block"
                                                    style={{ maxWidth: '100%' }}>
                                                    {inputValue ? `${inputValue}` : "Double-click to enter your option"}
                                                </strong>}
                                        </section>
                                        <input className="form-check-input" type="radio" name="folderGroupRadioGrid"
                                            id="folderGroupRadioGrid4"
                                            value={inputValue} defaultChecked=""
                                            onChange={handleChange} />
                                    </div>
                                </label>
                            </div>
                        </div>
                        :
                        <div className="d-flex justify-content-center">
                            <div className="spinner-grow"
                                style={{ width: '70px', height: '70px', color: '#c0edf4' }}
                                role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                }
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => { updateOpenModal('choose-folder-modal') }}>Back</Button>
                <Button variant="success" onClick={() => { updateOpenModal('choose-folder-location-modal') }}>Next</Button>
            </Modal.Footer>

        </Modal>

    );
}

export default ChooseFolderNameModal;