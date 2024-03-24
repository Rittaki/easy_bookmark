import './PopupStartWindow.css';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ChooseFolderModal from './Modals/ChooseFolderModal';
import AskUserModal from './Modals/AskUserModal';
import ChooseBookmarkNameModal from './Modals/ChooseBookmarkNameModal';
import ChooseFolderNameModal from './Modals/ChooseFolderNameModal';
import ChooseFolderLocationModal from './Modals/ChooseFolderLocationModal';
import FoldersList from './Sidebar/FoldersList/FoldersList';
import FoldersContainer from './MainContainer/FoldersContainer/FoldersContainer';
import BookmarksContainer from './MainContainer/BookmarksContainer/BookmarksContainer';

function PopupStartWindow() {
  const [state, setState] = useState({
    currentClickedLocationFolder: "main",
    currentClickedFolder: "main",
    currentUrl: null, openModal: '', isAnotherFolder: false,
    lastBookmark: { title: '', url: '', folder: '' },
    lastFolder: { name: '', parentFolder: '', linksNumber: 0 }
  });

  const handleClose = () => {
    setState((prevState) => ({ ...prevState, openModal: '' }));
    setState((prevState) => ({ ...prevState, currentClickedLocationFolder: 'main' }));

    const defaultBookmark = {
      title: "",
      url: "",
      folder: "",
    };
    setState((prevState) => ({ ...prevState, lastBookmark: defaultBookmark }));
    
    const defaultFolder = {
      name: "",
      parentFolder: "",
      linksNumber: 0,
    };
    setState((prevState) => ({ ...prevState, lastFolder: defaultFolder }));
  }

  useEffect(() => {
    console.log(state);
  }, [state])

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      const url = currentTab.url;
      console.log(url);
      setState((prevState) => ({ ...prevState, currentUrl: url }));
    });
  }, []);

  return (
    <div className="row">
      <div className="col-4 nav-side">
        <div className="container">
          <div className="row buttons-row">
            <ul className="nav nav-pills">
              <li className="nav-item">
                <button type="button" className="btn btn-primary nav-button" onClick={() => { setState((prevState) => ({ ...prevState, openModal: 'ask-user-modal' })) }}>New Bookmark</button>

                <AskUserModal show={state.openModal === 'ask-user-modal'} onHide={handleClose} setState={setState} state={state} />
                <ChooseFolderModal show={state.openModal === 'choose-folder-modal'} onHide={handleClose} setState={setState} state={state} />
                <ChooseBookmarkNameModal show={state.openModal === 'choose-bookmark-name-modal'} onHide={handleClose} setState={setState} state={state} />
                <ChooseFolderNameModal show={state.openModal === 'choose-folder-name-modal'} onHide={handleClose} setState={setState} state={state} />
                <ChooseFolderLocationModal show={state.openModal === 'choose-folder-location-modal'} onHide={handleClose} setState={setState} state={state} />

              </li>
              <li className="nav-item">
                <button type="button" className="btn btn-primary nav-button">Edit</button>
              </li>
              <li className="nav-item">
                <button type="button" className="btn btn-primary nav-button">Delete</button>
              </li>
            </ul>
          </div>
        </div>
        <div className="container folders-list-container">

          <FoldersList setState={setState} state={state} />

        </div>
      </div>
      <div className="col-8 right-side">
        <div className="container">
          <div className="row search-row">
            <form role="search">
              <input className="form-control" type="search" placeholder="Search" aria-label="Search" />
            </form>
          </div>
          <div className="row folders-row ">

            <FoldersContainer setState={setState} state={state} />
            <BookmarksContainer setState={setState} state={state} />

          </div>
        </div>
      </div>
    </div>
  );
}

export default PopupStartWindow;
