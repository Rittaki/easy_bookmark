import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function DeleteModal(props) {

    const handleDeleteFolder = () => {
        chrome.runtime.sendMessage({
            action: "deleteFolder",
            folderId: props.state.folderToDelete._id,
            folder: props.state.folderToDelete.name
        }, (response) => {
            if (response.success) {
                console.log("Folder deleted successfully (from react)");
                props.setState((prevState) => ({ ...prevState, reloadAfterAction: !props.state.reloadAfterAction }));
            };
        });
        props.onHide();
    };

    const handleDeleteBookmark = () => {
        console.log("inside delete bookmark, bookmark is", props.state.bookmarkToDelete);
        chrome.runtime.sendMessage({
            action: "deleteBookmark",
            bookmark: props.state.bookmarkToDelete,
        }, (response) => {
            if (response.success) {
                console.log("Bookmark deleted successfully (from react)");
                props.setState((prevState) => ({ ...prevState, reloadAfterAction: !props.state.reloadAfterAction }));
            };
        });
        props.onHide();
    };

    return (
        props.state.folderToDelete.name ? (
            <Modal show={props.show} onHide={props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete a folder</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this folder? <b>{props.state.folderToDelete.name}</b></Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.onHide}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={handleDeleteFolder}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        ) : props.state.bookmarkToDelete ? (
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Delete a bookmark</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this bookmark? <b>{props.state.bookmarkToDelete}</b></Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>
                    Cancel
                </Button>
                <Button variant="success" onClick={handleDeleteBookmark}>
                    Yes
                </Button>
            </Modal.Footer>
        </Modal>
        ) : (
            <Modal show={props.show} onHide={props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete a folder</Modal.Title>
                </Modal.Header>
                <Modal.Body>You didn't choose any folder/bookmark to delete </Modal.Body>
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