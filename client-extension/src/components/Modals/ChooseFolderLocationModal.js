import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './ChooseFolderLocationModal.css';
import FolderLocationNav from './FolderLocationNav/FolderLocationNav';

function ChooseFolderLocationModal(props) {

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
    };

    const updateBookmarkObject = async (newFolder, newPath = '') => {
        let response = await getPath(newFolder);

        const currentBookmark = props.state.lastBookmark;
        let updatedBookmark;
        if (newPath === '') {
            updatedBookmark = {
                ...currentBookmark,
                folder: newFolder,
                path: response + '/' + newFolder
            };
        }
        else {
            updatedBookmark = {
                ...currentBookmark,
                path: newPath + '/' + newFolder + '/' + currentBookmark.folder
            };
        }
        props.setState((prevState) => ({ ...prevState, lastBookmark: updatedBookmark }))
    };

    const updateFolderObject = async (newFolder) => {
        let newPath = await getPath(newFolder);
        updateBookmarkObject(newFolder, newPath);

        const currentFolder = props.state.lastFolder;
        const updatedFolder = {
            ...currentFolder,
            parentFolder: newFolder,
            path: newPath + '/' + newFolder
        };
        props.setState((prevState) => ({ ...prevState, lastFolder: updatedFolder }))
    };

    const updateOpenModal = (modalToOpen) => {
        props.setState((prevState) => ({ ...prevState, openModal: modalToOpen }))
    }
    return (

        <Modal className="modal-window" show={props.show} onHide={props.onHide}>

            <Modal.Header closeButton>
                <Modal.Title>Where do you want to put a folder?</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>Please choose a location:</p>
                <FolderLocationNav setState={props.setState} state={props.state} />
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => {
                    props.state.chooseExistingFolder ? updateOpenModal('choose-folder-modal') : updateOpenModal('choose-folder-name-modal');
                }}>Back</Button>
                <Button variant="success" onClick={() => {
                    if (props.state.chooseExistingFolder) {
                        props.setState((prevState) => ({ ...prevState, openModal: 'choose-bookmark-name-modal', isAnotherFolder: false }));
                        updateBookmarkObject(props.state.currentClickedLocationFolder)
                    } else {
                        props.setState((prevState) => ({ ...prevState, openModal: 'choose-bookmark-name-modal', isAnotherFolder: true }));
                        updateFolderObject(props.state.currentClickedLocationFolder)
                    }
                }}>Next</Button>
            </Modal.Footer>

        </Modal>

    );
}

export default ChooseFolderLocationModal;