import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './AskUserModal.css';

function AskUserModal(props) {

    const updateBookmarkObject = (newUrl) => {
        const currentBookmark = props.state.lastBookmark;
        const updatedBookmark = {
            ...currentBookmark,
            url: newUrl,
        };
        props.setState((prevState) => ({ ...prevState, lastBookmark: updatedBookmark }))
    }

    const updateOpenModal = (modalToOpen) => {
        props.setState((prevState) => ({ ...prevState, openModal: modalToOpen }))
        updateBookmarkObject(props.state.currentUrl);
    }

    return (

        <Modal className="modal-window" show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>New Bookmark</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>You are going to save this url as a new bookmark. Press "Next" if you want to proceed</p>
                <div className="folders-container">
                    <label htmlFor="urlInput" />
                    <input
                        style={{ height: '50px', width: '450px' }}
                        type="text" readOnly className="rounded-3" id="urlInput" value={props.state.currentUrl} />
                    <span id="currentUrl"></span>

                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>Close</Button>
                <Button variant="success" onClick={() => { updateOpenModal('choose-folder-modal') }}>Next</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AskUserModal;