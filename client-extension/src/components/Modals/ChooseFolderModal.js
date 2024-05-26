import './ChooseFolderModal.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';

function ChooseFolderModal(props) {
    const [chosenFolder, setChosenFolder] = useState("");
    const [folderNames, setFolderNames] = useState([]);

    // handle newFolder 
    const [newFolderSelected, setNewFolderSelected] = useState(false);

    useEffect(() => {
        if (props.show && (!folderNames.length)) {
            // if array of names is empty, fetch, if not - not fetch. Make array empty when onHide and when save
            console.log("inside 'useEffect' method in choose folder modal", props.show, "folders are empty:", folderNames);
            setFolderNames(["First", "CHeck"]);
            // chrome.runtime.sendMessage({
            //     action: "suggestFolders",
            //     url: props.state.lastBookmark.url
            // }, (response) => {
            //     if (response.success) {
            //         console.log('Folders fetched (message from client)', response);
            //         setFolderNames(response.success.folder_names);
            //         // setError(null);
            //     }
            //     else {
            //         setError(json.error);
            //     };
            // });
        }
    }, [props.show]);

    const handleChange = (e) => {
        console.log(e.target.value);
        setChosenFolder(e.target.value);
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
        updateBookmarkObject(chosenFolder);
        updateFolderObject(chosenFolder);
    }

    const closeModal = () => {
        props.onHide();
        setFolderNames([]); // search how to get to this from main component when closing/saving modal or move it to main state in popupStartWindow
        setNewFolderSelected(false);
    };

    return (

        <Modal className="modal-window" show={props.show} onHide={closeModal}>

            <Modal.Header closeButton>
                <Modal.Title>Choose a folder</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>Please choose the most suitable folder</p>
                {
                    folderNames.length ?
                        <div className="folders-container" style={{ width: '100%' }}>
                            {folderNames.length && folderNames.map((folderName, index) => (
                                <div key={index} className="bookmark-folder">
                                    <label className="form-check-label" htmlFor={`folderRadioGrid${index}`} onClick={() => setNewFolderSelected(false)}>
                                        <div className="d-flex flex-column flex-1 justify-between align-items-center p-4" style={{ width: "148px" }}>
                                            <img src="resources/folder.png" alt="folder img" loading="lazy" width="100vh" />
                                            <section className='d-grid' style={{ maxHeight: "fit-content", justifyItems: "center" }}>
                                                <strong className="fw-semibold text-truncate d-inline-block" style={{ maxWidth: '100%' }}>{folderName}</strong>
                                                <p className='mb-0'>10 links</p>
                                            </section>
                                            <input className="form-check-input" type="radio" name="folderRadioGrid"
                                                id={`folderRadioGrid${index}`}
                                                value={folderName} defaultChecked={folderName === chosenFolder ? true : false}
                                                onChange={handleChange} />
                                        </div>
                                    </label>
                                </div>
                            ))}

                            <div className="bookmark-folder">
                                <label className="form-check-label" htmlFor='folderRadioGrid3'
                                    onClick={() => {
                                        setNewFolderSelected(true);
                                        setChosenFolder("New");
                                        updateOpenModal('choose-folder-name-modal');
                                        props.setState((prevState) => ({ ...prevState, chooseExistingFolder: false }))
                                    }}>
                                    <div className="d-flex flex-column flex-1 justify-between align-items-center p-4" style={{ width: "148px" }}>
                                        <img src="resources/folder.png" alt="folder img" loading="lazy" width="100vh" />
                                        <section >
                                            <strong className="fw-semibold text-truncate d-inline-block opacity-50" style={{ maxWidth: '100%' }}>Create new folder...</strong>
                                            {/** <h6 className='opacity-50'>Create new folder...</h6>
                                            <Button variant="info" onClick={() => { updateOpenModal('choose-folder-name-modal') }}>Click</Button>**/}
                                        </section>
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
                <p className='mt-2'>Want to choose another existing folder? Click
                    <button className='fw-semibold another-folder-button px-1'
                        onClick={() => {
                            updateOpenModal('choose-folder-location-modal');
                            props.setState((prevState) => ({ ...prevState, chooseExistingFolder: true }))
                        }}>here</button>
                </p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => { updateOpenModal('ask-user-modal') }}>Back</Button>
                <Button variant="success" onClick={() => {
                    updateOpenModal('choose-bookmark-name-modal');
                    props.setState((prevState) => ({ ...prevState, isAnotherFolder: false, chooseExistingFolder: false }))
                }}>Next</Button>
            </Modal.Footer>

        </Modal>

    );
}

export default ChooseFolderModal;