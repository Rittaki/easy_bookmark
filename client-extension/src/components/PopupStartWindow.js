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

function PopupStartWindow() {
  const [state, setState] = useState({
    currentUrl: null, openModal: '', isAnotherFolder: false,
    lastBookmark: { url: "", title: '', folderName: '', timestamp: null },
    lastFolder: { folderName: '', parentFolder: '', linksNumber: 0 }
  });

  const handleClose = () => {
    setState((prevState) => ({ ...prevState, openModal: '' }));
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
        <div className="container">

          <FoldersList />
          
        </div>
      </div>
      <div className="col-8 right-side">
        <div className="container">
          <div className="row search-row">
            <form role="search">
              <input className="form-control" type="search" placeholder="Search" aria-label="Search" />
            </form>
          </div>
          <div className="row mt-2 gap-2">
            <div className="folders-container gap-2">
              <div className="card text-center bookmark-folder">
                <div className="flex flex-col flex-1 justify-between p-4">
                  <img src="resources/folder.png" alt="folder img" loading="lazy" width="100vh" />
                  <section >
                    <h6 >Drinks</h6>
                    <p >10 links</p>
                  </section>
                </div>
              </div>
              <div className="card text-center bookmark-folder">
                <div className="flex flex-col flex-1 justify-between p-4">
                  <img src="resources/folder.png" alt="folder img" loading="lazy" width="100vh" />
                  <section >
                    <h6 >Pattisserie</h6>
                    <p >15 links</p>
                  </section>
                </div>
              </div>
            </div>
            <div className="links-container">
              <div className="list-group list-group-flush">
                <a href="#" className="list-group-item list-group-item-action align-items-center d-flex gap-3" aria-current="true">
                  <img src="https://github.com/twbs.png" alt="twbs" width="32" height="32" className="rounded-circle flex-shrink-0" />
                  <div className="d-flex gap-2 w-100 align-items-center justify-content-between">
                    <div>
                      <h6 className="mb-0">List group item heading</h6>
                      <p className="mb-0 opacity-75">Some placeholder content in a paragraph.</p>
                    </div>
                    <small className="opacity-50 text-nowrap">New</small>
                  </div>
                </a>
                <a href="#" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">A list item
                  <span className="badge text-bg-primary rounded-pill">New</span>
                </a>
                <a href="#" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">A simple list group item
                  <small className="opacity-50 text-nowrap">New</small>
                </a>
                <a href="#" className="list-group-item list-group-item-action">A simple list group item</a>
                <a href="#" className="list-group-item list-group-item-action">A simple list group item</a>
                <a href="#" className="list-group-item list-group-item-action">A simple list group item</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PopupStartWindow;
