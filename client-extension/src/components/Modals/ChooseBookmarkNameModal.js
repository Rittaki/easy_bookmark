import './ChooseBookmarkNameModal.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';

function ChooseBookmarkNameModal(props) {
    const [toSave, setToSave] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState(null); // handle error later, after handling set to null again

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleFolderSave = (e) => {
        if (props.state.isAnotherFolder) {
            chrome.runtime.sendMessage({
                action: "addFolder",
                folder: props.state.lastFolder
            }, (response) => {
                if (response.success) {
                    console.log('Folder added (message from client)', response);
                    setError(null);
                }
                else {
                    setError(json.error);
                };
            })

            // console.log("after sending a folder");
            // const defaultFolder = {
            //     name: "",
            //     parentFolder: "",
            //     linksNumber: 0,
            // };
            // props.setState((prevState) => ({ ...prevState, lastFolder: defaultFolder }));

            props.setState((prevState) => ({ ...prevState, isAnotherFolder: false }));
        }
    };

    const handleBookmarkSave =  (e) => {
        // props.onHide();
        chrome.runtime.sendMessage({
            action: "addBookmark",
            bookmark: props.state.lastBookmark
        }, (response) => {
            if (response.success) {
                console.log('Bookmark added (message from client)', response);
                setError(null);
            }
            else {
                setError(json.error);
            };
        })

        // console.log("after sending a bookmark");
        // const defaultBookmark = {
        //     title: "",
        //     url: "",
        //     folder: "",
        // };
        // props.setState((prevState) => ({ ...prevState, lastBookmark: defaultBookmark }));
    };

    useEffect(() => {
        const handleSave = () => {
            console.log("inside 'handleSave' method");
            if (toSave) {
                console.log("inside 'handleSave' method condition");
                handleBookmarkSave();
                handleFolderSave();
                setToSave(false);
                setInputValue("");
                props.onHide();
            }
        };
        handleSave();
    }, [toSave]);

    const updateBookmarkObject = (bookmarkTitle) => {
        // props.onHide();
        const currentBookmark = props.state.lastBookmark;
        const updatedBookmark = {
            ...currentBookmark,
            title: bookmarkTitle
            // timestamp: Date().toString()
        };
        props.setState((prevState) => ({ ...prevState, lastBookmark: updatedBookmark }));
        setToSave(true);
    };

    const updateOpenModal = (modalToOpen) => {
        props.setState((prevState) => ({ ...prevState, openModal: modalToOpen }))
        setInputValue("");
        // updateBookmarkObject(inputValue);
    };



    return (
        <Modal className="modal-window" show={props.show} onHide={props.onHide}>

            <Modal.Header closeButton>
                <Modal.Title>Choose a name</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>Please choose the most suitable name for a bookmark</p>
                <div className="choose-bookmark">
                    <div className="list-group list-group-radio d-grid gap-2 border-0">
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="listGroupRadioGrid" id="listGroupRadioGrid1" value="" defaultChecked="" />
                            <label className="list-group-item py-3 pe-5" htmlFor="listGroupRadioGrid1">
                                <strong className="fw-semibold">First radio</strong>
                                <span className="d-block small opacity-75">With support text underneath to add more detail</span>
                            </label>
                        </div>

                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="listGroupRadioGrid" id="listGroupRadioGrid2" value="" />
                            <label className="list-group-item py-3 pe-5" htmlFor="listGroupRadioGrid2">
                                <strong className="fw-semibold">Second radio</strong>
                                <span className="d-block small opacity-75">Some other text goes here</span>
                            </label>
                        </div>

                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="listGroupRadioGrid" id="listGroupRadioGrid3" value="" />
                            <label className="list-group-item py-3 pe-5" htmlFor="listGroupRadioGrid3">
                                <strong className="fw-semibold">Third radio</strong>
                                <span className="d-block small opacity-75">And we end with another snippet of text</span>
                            </label>
                        </div>

                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="listGroupRadioGrid" id="listGroupRadioGrid4" />
                            <label className="list-group-item py-2 pe-5" htmlFor="listGroupRadioGrid4">
                                <div className="input-group mb-3">
                                    <input type="text" className="form-control"
                                        value={inputValue}
                                        onChange={handleInputChange}
                                        placeholder="Type here your option" />
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => {
                    (props.state.isAnotherFolder) ? updateOpenModal('choose-folder-location-modal')
                        : updateOpenModal('choose-folder-modal')
                }}>Back</Button>
                <Button variant="success" onClick={() => { updateBookmarkObject(inputValue); }}>Save</Button>
            </Modal.Footer>

        </Modal>

    );
}

export default ChooseBookmarkNameModal;