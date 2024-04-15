import './PopupStartWindow.css';
import { useState, useEffect, useRef } from 'react';
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

function PopupStartWindow() {
  const [state, setState] = useState({
    folderToDelete: null, bookmarkToDelete: null,
    folderToEdit: null, bookmarkToEdit: { title: "", url: "" },
    reloadAfterAction: false,
    isFolderEdited: false,
    currentClickedLocationFolder: "main",
    currentClickedFolder: null, currentClickedBookmark: null,
    currentFolderToLoad: "main",
    currentUrl: null, openModal: '', isAnotherFolder: false,
    lastBookmark: { title: '', url: '', folder: '' },
    lastFolder: { name: '', parentFolder: '', linksNumber: 0 }
  });

  const [currentBookmark, setCurrentBookmark] = useState({ id: "", title: "", url: "" });

  const [currentFolder, setCurrentFolder] = useState({ id: "", name: "" });

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
        (prevState) => ({ ...prevState, id: rightClickedItem._id, title: rightClickedItem.title, url: rightClickedItem.url }));
    }
    else if (itemType === 'folder') {
      setCurrentFolder(
        (prevState) => ({ ...prevState, id: rightClickedItem._id, name: rightClickedItem.name }));
    }
  };

  const resetContextMenu = () => {
    setContextMenu({ position: { x: 0, y: 0 }, toggled: false });

    setCurrentFolder((prevState) => ({ ...prevState, id: "", name: "" }));
    setCurrentBookmark((prevState) => ({ ...prevState, id: "", title: "", url: "" }));
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

            <FoldersContainer handleOnContextMenu={handleOnContextMenu} setState={setState} state={state} />
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
        </div>
      </div>
    </div>
  );
}

export default PopupStartWindow;
