import './ChooseFolderModal.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';

function ChooseFolderModal(props) {
    const [chosenFolder, setChosenFolder] = useState("");
    const [folderNames, setFolderNames] = useState([]);
    const { user } = useAuthContext();

    // handle newFolder 
    const [newFolderSelected, setNewFolderSelected] = useState(false);

    useEffect(() => {
        if (props.show && (!folderNames.length)) {
            console.log("inside 'useEffect' method in choose folder modal", props.show, "folders are empty:", folderNames);
            // setFolderNames(["First", "CHeck"]);
            chrome.runtime.sendMessage({
                action: "suggestFolders",
                url: props.state.lastBookmark.url,
                userId: user.uid
            }, (response) => {
                if (response.success) {
                    console.log('Folders fetched (message from client)', response);
                    setFolderNames(response.success.folder_names);
                    // setError(null);
                }
                else {
                    setError(json.error);
                };
            });
        }
    }, [props.show]);

    const handleChange = (e) => {
        console.log(e.target.value);
        setChosenFolder(e.target.value);
    };

    const updateFolderObject = (newFolder, newPath) => {
        const currentFolder = props.state.lastFolder;
        const updatedFolder = {
            ...currentFolder,
            name: newFolder,
            path: newPath
        };
        props.setState((prevState) => ({ ...prevState, lastFolder: updatedFolder }));
    };

    const updateBookmarkObject = (newFolder, newPath) => {
        const currentBookmark = props.state.lastBookmark;
        const updatedBookmark = {
            ...currentBookmark,
            folder: newFolder,
            path: newPath + '/' + newFolder
        };
        props.setState((prevState) => ({ ...prevState, lastBookmark: updatedBookmark }))
    };

    const getPath = async (chosenFolder) => {
        try {
            let response = await chrome.runtime.sendMessage({
                action: "getFolderByName",
                folderName: chosenFolder
            });
            console.log(`${chosenFolder} fetched`, response.success);
            return response.success[0].path;
        }
        catch (error) {
            console.log('Error fetching folder by name', error);
        }
    }

    const updateOpenModal = async (modalToOpen, isSuggestedFolder = false) => {
        props.setState((prevState) => ({ ...prevState, openModal: modalToOpen }))
        let path = '';
        if (isSuggestedFolder) {
            path = await getPath(chosenFolder);
        }
        updateBookmarkObject(chosenFolder, path);
        updateFolderObject(chosenFolder, path);
    }

    const closeModal = () => {
        props.onHide();
        setFolderNames([]);
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
                                folderName === 'none' ?
                                    <div></div> :
                                    <div key={index} className="bookmark-folder">
                                        <label className="form-check-label" htmlFor={`folderRadioGrid${index}`} onClick={() => setNewFolderSelected(false)}>
                                            <div className="d-flex flex-column flex-1 justify-between align-items-center p-4" style={{ width: "148px" }}>
                                                <img src="resources/Folder1.png" alt="folder img" loading="lazy"
                                                    width="160vh" height="160vh"
                                                    style={{ marginTop: '-10px' }} />
                                                <section className='d-grid' style={{ maxHeight: "fit-content", justifyItems: "center" }}>
                                                    <p className="text-truncate d-inline-block"
                                                        style={{
                                                            maxWidth: '100%', marginTop: '-40px'
                                                        }}>
                                                        {folderName}
                                                    </p>
                                                    {/**<p className='mb-0'>10 links</p>**/}
                                                </section>
                                                <input className="form-check-input" type="radio" name="folderRadioGrid"
                                                    style={{ marginTop: '-10px' }}
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
                                        setChosenFolder("_new");
                                        updateOpenModal('choose-folder-name-modal');
                                        props.setState((prevState) => ({ ...prevState, chooseExistingFolder: false }))
                                    }}>
                                    <div className="d-flex flex-column flex-1 justify-between align-items-center p-4" style={{ width: "148px" }}>
                                        <img src="resources/Folder1.png" alt="folder img" loading="lazy"
                                            width="160vh" height="160vh"
                                            style={{ marginTop: '-10px' }} />
                                        <section style={{ marginTop: '-17px' }}>
                                            <p className="text-truncate d-inline-block opacity-50"
                                                style={{ maxWidth: '100%', marginTop: '-40px', fontWeight: '100 !important' }}>Create new folder...</p>
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
                    updateOpenModal('choose-bookmark-name-modal', true);
                    props.setState((prevState) => ({ ...prevState, isAnotherFolder: false, chooseExistingFolder: false }))
                }}>Next</Button>
            </Modal.Footer>

        </Modal>

    );
}

export default ChooseFolderModal;