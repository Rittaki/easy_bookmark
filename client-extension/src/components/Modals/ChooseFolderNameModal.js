import './ChooseFolderNameModal.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';

function ChooseFolderNameModal(props) {
    const [chosenFolderName, setChosenFolderName] = useState("");
    const [folderNames, setFolderNames] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState(null); 

    // handle otherInput 
    const [otherSelected, setOtherSelected] = useState(false);

    useEffect(() => {
        if (props.show && (!folderNames.length)) {
            console.log("inside 'useEffect' method in choose folder name modal", props.show, "names are empty:", folderNames);
            // setFolderNames(["First", "Second", "Third"]);
            chrome.runtime.sendMessage({
                action: "generateFolders",
                url: props.state.lastBookmark.url
            }, (response) => {
                if (response.success) {
                    console.log('Folders fetched (message from client)', response);
                    setFolderNames(response.success.folder_names);
                    setError(null);
                }
                else {
                    setError(json.error);
                };
            });
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
                                        <div className="flex flex-col flex-1 justify-between new-folder px-2 py-4">
                                            <img src="resources/Folder1.png" alt="folder img" loading="lazy"
                                                width="160vh" height="160vh"
                                                style={{ marginTop: '-10px' }}
                                            />
                                            <section className='d-grid' style={{ maxHeight: "fit-content", justifyItems: "center" }}>
                                                <p className="text-truncate d-inline-block"
                                                    style={{
                                                        maxWidth: '100%', marginTop: '-30px'
                                                    }}>{folderName}</p>

                                            </section>
                                            <input className="form-check-input" type="radio" name="folderGroupRadioGrid"
                                                style={{ marginTop: '-10px' }}
                                                id={`folderGroupRadioGrid${index}`}
                                                value={folderName} defaultChecked={folderName === chosenFolderName ? true : false}
                                                onChange={handleChange} />
                                        </div>
                                    </label>
                                </div>
                            ))}

                            <div className="bookmark-folder">
                                <label className="form-check-label" htmlFor='folderGroupRadioGrid4' onClick={() => setOtherSelected(true)}>
                                    <div className="flex flex-col flex-1 justify-between new-folder px-2 py-4">
                                        <img src="resources/Folder1.png" alt="folder img" loading="lazy"
                                            width="160vh" height="160vh"
                                            style={{ marginTop: '-10px' }}
                                        />
                                        <section className='d-grid' style={{ maxHeight: "fit-content", justifyItems: "center", height: "30px", maxWidth: '100%' }}>
                                            {otherSelected ?
                                                <div className="input-group"
                                                    style={{ marginBottom: '10px' }}>
                                                    <input type="text" className=" text-truncate d-inline-block"
                                                        style={{ height: 'fit-content', maxWidth: '100%', marginTop: '-30px' }}
                                                        id="otherInput"
                                                        value={inputValue}
                                                        onChange={handleInputChange}
                                                        placeholder="Type here your option" />
                                                </div>
                                                : <p className="opacity-25 text-truncate d-inline-block"
                                                    style={{ maxWidth: '100%', marginTop: '-30px' }}>
                                                    {inputValue ? `${inputValue}` : "Double-click to enter your option"}
                                                </p>}
                                        </section>
                                        <input className="form-check-input" type="radio" name="folderGroupRadioGrid"
                                            style={{ marginTop: '-10px' }}
                                            id="folderGroupRadioGrid4"
                                            value={inputValue} defaultChecked={otherSelected}
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