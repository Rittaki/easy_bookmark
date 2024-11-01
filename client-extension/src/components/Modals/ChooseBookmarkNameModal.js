import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './ChooseBookmarkNameModal.css';

function ChooseBookmarkNameModal(props) {
    const [chosenTitle, setChosenTitle] = useState("");
    const [titles, setTitles] = useState([]);
    const [toSave, setToSave] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState(null); // handle error later, after handling set to null again

    // handle otherInput 
    const [otherSelected, setOtherSelected] = useState(false);

    useEffect(() => {
        if (props.show && (!titles.length)) {
            console.log("inside 'useEffect' method in choose name modal", props.show, "titles are empty:", titles);
            // setTitles(["First", "Second", "Third"]);
            chrome.runtime.sendMessage({
                action: "generateTitles",
                url: props.state.lastBookmark.url
            }, (response) => {
                if (response.success) {
                    console.log('Titles fetched (message from client)', response);
                    setTitles(response.success.titles);
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
        setChosenTitle(e.target.value);
    };

    const handleChange = (e) => {
        console.log(e.target.value);
        setChosenTitle(e.target.value);
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
            props.setState((prevState) => ({ ...prevState, isAnotherFolder: false }));
        }
    };

    const handleBookmarkSave = (e) => {
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
                setTitles([]);
                setOtherSelected(false);
            }
            props.setState((prevState) => ({ ...prevState, reloadAfterAction: !prevState.reloadAfterAction }));
        };
        handleSave();
    }, [toSave]);

    const updateBookmarkObject = (bookmarkTitle) => {
        const currentBookmark = props.state.lastBookmark;
        const updatedBookmark = {
            ...currentBookmark,
            title: bookmarkTitle
        };
        props.setState((prevState) => ({ ...prevState, lastBookmark: updatedBookmark }));
    };

    const updateOpenModal = (modalToOpen) => {
        props.setState((prevState) => ({ ...prevState, openModal: modalToOpen }))
        updateBookmarkObject(chosenTitle);
    };

    const closeModal = () => {
        props.onHide();
        setTitles([]);
        setInputValue("");
        setOtherSelected(false);
    };

    return (
        <Modal className="modal-window" show={props.show} onHide={closeModal}>

            <Modal.Header closeButton>
                <Modal.Title>Choose a name</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>Please choose the most suitable name for a bookmark</p>
                {
                    titles.length ?
                        <div className="choose-bookmark">
                            <div className="list-group list-group-radio d-grid gap-2 border-0">
                                {titles.length && titles.map((title, index) => (
                                    <div key={index} className="form-check title-item">
                                        <input className="form-check-input" type="radio" name="listGroupRadioGrid"
                                            id={`listGroupRadioGrid${index}`}
                                            value={title} defaultChecked={title === chosenTitle ? true : false}
                                            onChange={handleChange} />
                                        <label className="list-group-item py-3 px-3 ms-3 new-title" htmlFor={`listGroupRadioGrid${index}`} onClick={() => setOtherSelected(false)}>
                                            <p className="text-truncate d-inline-block" style={{ maxWidth: '100%', fontFamily: 'Poppins' }}>{title}</p>
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <div className="list-group list-group-radio d-grid gap-2 border-0 mt-2">
                                <div className="form-check title-item">
                                    <input className="form-check-input" type="radio" name="listGroupRadioGrid"
                                        id="listGroupRadioGrid4"
                                        onChange={handleChange}
                                        defaultChecked={otherSelected}
                                        value={inputValue} />
                                    <label className="list-group-item py-3 px-3 ms-3 new-title" htmlFor="listGroupRadioGrid4" onClick={(e) => { setOtherSelected(true) }}>

                                        {otherSelected ?
                                            <div className="input-group">
                                                <input type="text"
                                                    style={{ fontFamily: 'Poppins', backgroundColor: '#f2fbfd' }}
                                                    id="otherInput"
                                                    value={inputValue}
                                                    onChange={handleInputChange}
                                                    placeholder="Type here your option" />
                                            </div>
                                            : <p className="opacity-25 text-truncate d-inline-block"
                                                style={{ maxWidth: '100%', fontFamily: 'Poppins', color: '#5fd8f6' }}>
                                                {inputValue ? `${inputValue}` : "Double-click to enter your option"}
                                            </p>}

                                    </label>
                                </div>
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
                <Button variant="secondary" onClick={() => {
                    (props.state.isAnotherFolder || props.state.chooseExistingFolder) ? updateOpenModal('choose-folder-location-modal')
                        : updateOpenModal('choose-folder-modal')
                }}>Back</Button>
                <Button variant="success" onClick={() => { updateBookmarkObject(chosenTitle); setToSave(true); }}>Save</Button>
            </Modal.Footer>

        </Modal>

    );
}

export default ChooseBookmarkNameModal;