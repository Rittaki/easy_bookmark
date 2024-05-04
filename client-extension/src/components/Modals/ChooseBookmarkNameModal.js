import './ChooseBookmarkNameModal.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useState, useEffect } from 'react';

function ChooseBookmarkNameModal(props) {
    const [chosedTitle, setChosedTitle] = useState("");
    const [titles, setTitles] = useState([]);
    const [toSave, setToSave] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState(null); // handle error later, after handling set to null again

    // handle otherInput 
    const [otherSelected, setOtherSelected] = useState(false);

    useEffect(() => {
        if (props.show && (!titles.length)) {
            // if array of names is empty, fetch, if not - not fetch. Make array empty when onHide and when save
            console.log("inside 'useEffect' method in choose name modal", props.show, "titles are empty:", titles);
            setTitles(["First", "Second", "Third"]);
            // chrome.runtime.sendMessage({
            //     action: "generateTitles",
            //     url: props.state.lastBookmark.url
            // }, (response) => {
            //     if (response.success) {
            //         console.log('Titles fetched (message from client)', response);
            //         setTitles(response.success.titles);
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
        setChosedTitle(e.target.value);
    };

    const handleChange = (e) => {
        console.log(e.target.value);
        setChosedTitle(e.target.value);
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

    const handleBookmarkSave = (e) => {
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
                setTitles([]);
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

    const closeModal = () => {
        props.onHide();
        setTitles([]);
        setInputValue("");
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
                                            value={title} defaultChecked=""
                                            onChange={handleChange} />
                                        <label className="list-group-item py-3 px-3 ms-3 new-title" htmlFor={`listGroupRadioGrid${index}`} onClick={() => setOtherSelected(false)}>
                                            <strong className="fw-semibold text-truncate d-inline-block" style={{ maxWidth: '100%' }}>{title}</strong>
                                            {/**<span className="d-block small opacity-75">With support text underneath to add more detail</span>**/}
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <div className="list-group list-group-radio d-grid gap-2 border-0 mt-2">
                                <div className="form-check title-item">
                                    <input className="form-check-input" type="radio" name="listGroupRadioGrid"
                                        id="listGroupRadioGrid4"
                                        onChange={handleChange}
                                        value={inputValue} />
                                    <label className="list-group-item py-3 px-3 ms-3 new-title" htmlFor="listGroupRadioGrid4" onClick={(e) => { setOtherSelected(true) }}>

                                        {otherSelected ?
                                            <div className="input-group">
                                                <input type="text" className="fw-semibold"
                                                    id="otherInput"
                                                    value={inputValue}
                                                    onChange={handleInputChange}
                                                    placeholder="Type here your option" />
                                            </div>
                                            : <strong className="fw-semibold opacity-25 text-truncate d-inline-block"
                                                style={{ maxWidth: '100%' }}>
                                                {inputValue ? `${inputValue}` : "Double-click to enter your option"}
                                            </strong>}

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
                    (props.state.isAnotherFolder) ? updateOpenModal('choose-folder-location-modal')
                        : updateOpenModal('choose-folder-modal')
                }}>Back</Button>
                <Button variant="success" onClick={() => { updateBookmarkObject(chosedTitle); }}>Save</Button>
            </Modal.Footer>

        </Modal>

    );
}

export default ChooseBookmarkNameModal;