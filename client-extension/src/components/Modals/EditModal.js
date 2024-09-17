import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';

function EditModal(props) {
    const [folderName, setFolderName] = useState("");
    const [bookmarkTitle, setBookmarkTitle] = useState("");
    const [bookmarkUrl, setBookmarkUrl] = useState("");

    const handleFolderChange = (event) => {
        console.log("handleFolderChange");
        setFolderName(event.target.value);
    };

    const handleBookmarkTitleChange = (event) => {
        console.log("handleBookmarkTitleChange");
        setBookmarkTitle(event.target.value);
    };


    const handleBookmarkUrlChange = (event) => {
        console.log("handleBookmarkUrlChange");
        setBookmarkUrl(event.target.value);
    };


    useEffect(() => {
        if (props.state.folderToEdit) {
            setFolderName(props.state.folderToEdit);
        }
        if (props.state.bookmarkToEdit) {
            setBookmarkTitle(props.state.bookmarkToEdit.title);
            setBookmarkUrl(props.state.bookmarkToEdit.url);
        }
    }, [props.state.folderToEdit, props.state.bookmarkToEdit]);

    const handleEditFolder = () => {
        chrome.runtime.sendMessage({
            action: "updateFolder",
            folder: props.state.folderToEdit,
            newName: folderName
        }, (response) => {
            if (response.success) {
                console.log("Folder updated successfully (from react)");
                props.setState((prevState) => ({ ...prevState, isFolderEdited: true }));
                props.setState((prevState) => ({ ...prevState, reloadAfterAction: !props.state.reloadAfterAction}));
            };
        });
        props.onHide();
    };
    
    const handleEditBookmark = () => {
        console.log("updating bookmark");
        chrome.runtime.sendMessage({
            action: "updateBookmark",
            bookmark: props.state.bookmarkToEdit.url,
            newTitle: bookmarkTitle,
            newUrl: bookmarkUrl
        }, (response) => {
            if (response.success) {
                console.log("Bookmark updated successfully (from react)");
                props.setState((prevState) => ({ ...prevState, reloadAfterAction: !props.state.reloadAfterAction }));
            };
        });
        props.onHide();
    };

    return (
        props.state.folderToEdit ? (
            <Modal show={props.show} onHide={props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit a folder</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label htmlFor="folder-name" className="form-label">Type a new name for a folder:</label>
                        <input type="text" className="form-control" id="folder-name" placeholder="Folder Name"
                            value={folderName}
                            onChange={handleFolderChange}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.onHide}>
                        Cancel
                    </Button>
                    <Button variant="success"
                        onClick={handleEditFolder}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        ) : props.state.bookmarkToEdit ? (
            <Modal show={props.show} onHide={props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit a bookmark</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label htmlFor="bookmark-title" className="form-label">Type a new title for a bookmark:</label>
                        <input type="text" className="form-control" id="bookmark-title" placeholder="Bookmark Title"
                            value={bookmarkTitle}
                            onChange={handleBookmarkTitleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="bookmark-url" className="form-label">Edit an url for a bookmark:</label>
                        <input type="text" className="form-control" id="bookmark-url" placeholder="Bookmark Url"
                            value={bookmarkUrl}
                            onChange={handleBookmarkUrlChange}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.onHide}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={handleEditBookmark}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        ) : (
            <Modal show={props.show} onHide={props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit a folder/bookmark</Modal.Title>
                </Modal.Header>
                <Modal.Body>You didn't choose any folder/bookmark to edit </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.onHide}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    );
}

export default EditModal;