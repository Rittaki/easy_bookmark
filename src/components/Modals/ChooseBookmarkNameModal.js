import './ChooseBookmarkNameModal.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';

function ChooseBookmarkNameModal(props) {
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
                                <strong className="fw-semibold">Fourth disabled radio</strong>
                                <span className="d-block small opacity-75">This option is disabled</span>
                            </label>
                        </div>
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer>
                {(props.state.isAnotherFolder) ? (<Button variant="secondary" onClick={() => { props.setState((prevState) => ({ ...prevState, openModal: 'choose-folder-location-modal' })) }}>Back</Button>)
                    : <Button variant="secondary" onClick={() => { props.setState((prevState) => ({ ...prevState, openModal: 'choose-folder-modal' })) }}>Back</Button>}
                <Button variant="success" onClick={props.onHide}>Next</Button>
            </Modal.Footer>

        </Modal>

    );
}

export default ChooseBookmarkNameModal;