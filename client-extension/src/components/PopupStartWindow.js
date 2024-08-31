import './PopupStartWindow.css';
import { useState, useEffect, useRef } from 'react';
import { useAuthContext } from './hooks/useAuthContext';
import ChooseFolderModal from './Modals/ChooseFolderModal';
import AskUserModal from './Modals/AskUserModal';
import ChooseBookmarkNameModal from './Modals/ChooseBookmarkNameModal';
import ChooseFolderNameModal from './Modals/ChooseFolderNameModal';
import ChooseFolderLocationModal from './Modals/ChooseFolderLocationModal';
import FoldersList from './Sidebar/FoldersList/FoldersList';
import FoldersContainer from './MainContainer/FoldersContainer/FoldersContainer';
import BookmarksContainer from './MainContainer/BookmarksContainer/BookmarksContainer';
import DeleteModal from './Modals/DeleteModal';
import EditModal from './Modals/EditModal';
import ContextMenu from './ContextMenu/ContextMenu';
import SearchResultsContainer from './MainContainer/SearchResultsContainer/SearchResultsContainer';
import SearchBar from './MainContainer/SearchBar/SearchBar';
import Breadcrumbs from './MainContainer/Breadcrumbs/Breadcrumbs';
import Logout from './MainContainer/Logout/Logout';
import BackForward from './MainContainer/BackForward/BackForward';
import { useHistoryContext } from './hooks/useHistoryContext';

function PopupStartWindow() {
  const { user } = useAuthContext();
  const [state, setState] = useState({
    chooseExistingFolder: false,
    folderToDelete: null, bookmarkToDelete: null,
    folderToEdit: null, bookmarkToEdit: { title: "", url: "" },
    reloadAfterAction: false,
    isFolderEdited: false,
    currentClickedLocationFolder: "Home",
    currentClickedFolder: null, currentClickedBookmark: null,
    // currentFolderToLoad: "Home",
    currentFolderToLoad: {_id: "66a65fac5eddc59b4d8525f6", name: "Home", parentFolder: "", linksNumber: 2, path: "/"},
    currentUrl: null, openModal: '', isAnotherFolder: false,
    lastBookmark: { title: '', url: '', folder: '', path: '', userId: user.uid },
    lastFolder: { name: '', parentFolder: '', linksNumber: 0, path: '', userId: user.uid }
  });

  // breadcrumbs
  const [crumbs, setCrumbs] = useState([]);
  const { handleFolderClick } = useHistoryContext();

  const selected = (crumb, response) => {
    console.log('Response:', response);
    const crumbs = response[0].path.split('/').filter((crumb) => crumb !== '');
    console.log('Crumbs:', crumbs);

    setCrumbs(crumbs);
    setState((prevState) => ({ ...prevState, currentFolderToLoad: response[0] }));
    handleFolderClick(response[0]);
  }

  // search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [webSearch, setWebSearch] = useState(false);
  const [webSearchResults, setWebSearchResults] = useState(false);

  // maybe add here the states for chat-gpt generated objects

  const [currentBookmark, setCurrentBookmark] = useState({ id: "", title: "", url: "", path: "" });

  const [currentFolder, setCurrentFolder] = useState({ id: "", name: "", parentFolder: "", linksNumber: 0, path: "" });

  // Context menu logic
  const contextMenuRef = useRef(null);
  const [contextMenu, setContextMenu] = useState({ position: { x: 0, y: 0 }, toggled: false });

  const handleOnContextMenu = (e, rightClickedItem, itemType) => {
    e.preventDefault();

    const contextMenuAttr = contextMenuRef.current.getBoundingClientRect();
    const isLeft = e.clientX < window?.innerWidth / 2

    let x
    let y = e.clientY

    if (isLeft) {
      x = e.clientX
    } else {
      x = e.clientX - contextMenuAttr.width
    }

    setContextMenu({ position: { x, y }, toggled: true });

    console.log(rightClickedItem);
    if (itemType === 'bookmark') {
      setCurrentBookmark(
        (prevState) => ({ ...prevState, id: rightClickedItem._id, title: rightClickedItem.title, url: rightClickedItem.url, path: rightClickedItem.path }));
    }
    else if (itemType === 'folder') {
      setCurrentFolder(
        (prevState) => ({ ...prevState, id: rightClickedItem._id, name: rightClickedItem.name, parentFolder: rightClickedItem.parentFolder, linksNumber: rightClickedItem.linksNumber, path: rightClickedItem.path }));
    }
  };

  const resetContextMenu = () => {
    setContextMenu({ position: { x: 0, y: 0 }, toggled: false });

    setCurrentFolder((prevState) => ({ ...prevState, id: "", name: "", parentFolder: "", linksNumber: 0, path: "" }));
    setCurrentBookmark((prevState) => ({ ...prevState, id: "", title: "", url: "", path: "" }));
  };

  useEffect(() => {
    function handler(e) {
      if (contextMenuRef.current) {
        if (!contextMenuRef.current.contains(e.target)) {
          resetContextMenu();
        }
      }
    }

    document.addEventListener('click', handler);

    return () => {
      document.removeEventListener('click', handler)
    }
  })

  // Delete Modal logic
  const [showDelete, setShowDelete] = useState(false);

  const handleDeleteCloseModal = () => {
    setShowDelete(false);
    setState((prevState) => ({ ...prevState, folderToDelete: null }));
    setState((prevState) => ({ ...prevState, bookmarkToDelete: null }));
  };
  const handleDeleteShowModal = () => setShowDelete(true);

  const handleDelete = () => {
    console.log('Delete')
    setState((prevState) => ({ ...prevState, folderToDelete: currentFolder.name }));
    setState((prevState) => ({ ...prevState, bookmarkToDelete: currentBookmark.title }));
    console.log('Folder is: ' + state.folderToDelete);
    console.log('Bookmark is: ' + state.bookmarkToDelete);
    console.log("Delete clicked");
    handleDeleteShowModal();
  };

  // Edit Modal logic
  const [showEdit, setShowEdit] = useState(false);

  const handleEditCloseModal = () => {
    setShowEdit(false);
    setState((prevState) => ({ ...prevState, folderToEdit: null }));
    setState((prevState) => ({ ...prevState, bookmarkToEdit: { title: "", url: "" } }));
  };
  const handleEditShowModal = () => setShowEdit(true);

  const handleEdit = () => {
    console.log('inside handleEdit');
    setState((prevState) => ({ ...prevState, folderToEdit: currentFolder.name }));
    setState((prevState) => ({ ...prevState, bookmarkToEdit: { title: currentBookmark.title, url: currentBookmark.url } }));
    console.log('Folder is: ' + state.folderToEdit);
    console.log('Bookmark is: ' + state.bookmarkToEdit);
    console.log("Edit clicked");
    handleEditShowModal();
  };

  // Other logic
  const handleClose = () => {
    setState((prevState) => ({ ...prevState, openModal: '' }));
    console.log("I'm from original close function");
    setState((prevState) => ({ ...prevState, currentClickedLocationFolder: 'main' }));
    setState((prevState) => ({ ...prevState, chooseExistingFolder: false }));

    const defaultBookmark = {
      title: "",
      url: "",
      folder: "",
      path: "",
      userId: user.uid
    };
    setState((prevState) => ({ ...prevState, lastBookmark: defaultBookmark }));

    const defaultFolder = {
      name: "",
      parentFolder: "",
      linksNumber: 0,
      path: "",
      userId: user.uid
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

              <BackForward state={state} setState={setState} setCrumbs={setCrumbs}/>

            </ul>
          </div>
        </div>
        <div className="container folders-list-container">

          <FoldersList setState={setState} state={state} setCrumbs={setCrumbs} />

        </div>
      </div>
      <div className="col-8 right-side">
        <div className="container">
          <div className="row">
            <div className='col'>
              <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} setSearchResults={setSearchResults}
                webSearch={webSearch} setWebSearch={setWebSearch} setWebSearchResults={setWebSearchResults}
                state={state} />
            </div>
            <div className='col-2 px-0'>
              <Logout />
            </div>
          </div>

          {searchTerm ?
            <SearchResultsContainer searchTerm={searchTerm} setSearchTerm={setSearchTerm} searchResults={searchResults}
              setState={setState} state={state} setCrumbs={setCrumbs}
              webSearch={webSearch} setWebSearch={setWebSearch} webSearchResults={webSearchResults}/>
            :
            <div className="row folders-row ">
              <Breadcrumbs crumbs={crumbs} selected={selected} state={state} />              
              <FoldersContainer handleOnContextMenu={handleOnContextMenu} setState={setState} state={state} setCrumbs={setCrumbs} crumbs={crumbs} />
              <BookmarksContainer handleOnContextMenu={handleOnContextMenu} setState={setState} state={state} />
              <ContextMenu
                contextMenuRef={contextMenuRef}
                isToggled={contextMenu.toggled}
                positionX={contextMenu.position.x}
                positionY={contextMenu.position.y}
                buttons={[
                  {
                    text: 'Edit',
                    onClick: () => handleEdit()
                  },
                  {
                    text: 'Delete',
                    onClick: () => handleDelete()
                  },
                  {
                    text: 'Details',
                    onClick: () => console.log('Details')
                  }
                ]}
              />

              <EditModal show={showEdit} onHide={handleEditCloseModal} setState={setState} state={state} />
              <DeleteModal show={showDelete} onHide={handleDeleteCloseModal} setState={setState} state={state} />
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default PopupStartWindow;
