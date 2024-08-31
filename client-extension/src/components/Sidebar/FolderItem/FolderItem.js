import { useEffect, useState } from "react";
import { useAuthContext } from '../../hooks/useAuthContext';
import { useHistoryContext } from "../../hooks/useHistoryContext";
import "./FolderItem.css";

function FolderItem(props) {
    const [folders, setFolders] = useState(null);
    const [toLoad, setToLoad] = useState(false);
    const { user } = useAuthContext();
    const { backStack, forwardStack, handleFolderClick } = useHistoryContext();
    const [toShowSubfolders, setToShowSubfolders] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const updateCrumbs = (newCrumbs) => {
        const crumbs = newCrumbs.split('/').filter((crumb) => crumb !== '');
        console.log('Crumbs:', crumbs);
        props.setCrumbs(crumbs);
    }

    useEffect(() => {
        if (toLoad) {
            chrome.runtime.sendMessage({
                action: "getFolders",
                folder: props.folder.name,
                userId: user.uid
            }, (response) => {
                if (response.success) {
                    console.log(`${props.folder.name} folders fetched`, response.success);
                    setFolders(response.success);
                    setToLoad(false);
                };
            });
        };
    }, [toLoad, props.state.reloadAfterAction]);

    const updateCurrentFolder = (folder) => {
        props.setState((prevState) => ({ ...prevState, currentFolderToLoad: folder }));
        if (backStack[backStack.length - 1]._id !== folder._id) {
            handleFolderClick(folder);
        }
        updateCrumbs(folder.path);
    };

    const handleOnDrop = (event) => {
        const type = event.dataTransfer.getData("type");

        if (type === 'folder') {
            const folder = event.dataTransfer.getData("folder");
            console.log('dropped', folder, 'of type', type);
            chrome.runtime.sendMessage({
                action: "moveFolder",
                folder: folder,
                newParent: JSON.stringify(props.folder)
            }, (response) => {
                if (response.success) {
                    console.log('Folder moved successfully', response.success);
                    setToLoad(true);
                    props.setState((prevState) => ({ ...prevState, reloadAfterAction: !prevState.reloadAfterAction }));
                } else {
                    console.log('Failed to move folder', response.error);
                }
            });
        } else if (type === 'bookmark') {
            const bookmark = event.dataTransfer.getData("bookmark");
            console.log('dropped', bookmark, 'of type', type);
            chrome.runtime.sendMessage({
                action: "moveBookmark",
                bookmark: bookmark,
                folder: JSON.stringify(props.folder)
            }, (response) => {
                if (response.success) {
                    console.log('Bookmark moved successfully', response.success);
                    setToLoad(true);
                    props.setState((prevState) => ({ ...prevState, reloadAfterAction: !prevState.reloadAfterAction }));
                } else {
                    console.log('Failed to move bookmark', response.error);
                }
            });
        }
    }

    const handleOnDragEnter = (event) => {
        event.preventDefault();
        setIsDragging(true);
        console.log('dragging enter for:', props.folder.name);
        setToShowSubfolders(true);
        setToLoad(true);
    }

    const handleOnDragLeave = (event) => {
        event.preventDefault();
        setIsDragging(false);
        console.log('dragging leave for:', props.folder.name);
    }

    return (
        <li className="mb-1 mt-1">
            <button
                style={{ width: "100%" }}
                className={`btn btn-toggle align-items-center rounded ${toShowSubfolders ? '' : 'collapsed'}`}
                data-bs-toggle="collapse" data-bs-target={"#" + props.folder.name.split(" ").join("") + "-collapse"}
                aria-expanded={`${toShowSubfolders ? 'true' : 'false'}`}
                onClick={() => {
                    setToLoad(true);
                }}
                onDrop={(e) => { handleOnDrop(e) }}
                onDragEnter={(e) => { handleOnDragEnter(e) }}
                onDragOver={(e) => { e.preventDefault(); }}
                onDragLeave={(e) => { handleOnDragLeave(e) }}
            >
                <span className="folder-button align-items-center rounded"
                    onClick={() => {
                        updateCurrentFolder(props.folder);
                    }}>
                    {props.folder.name}
                </span>
            </button>
            <ul className={`list-unstyled ps-3 collapse ${toShowSubfolders ? 'show' : ''}`} id={props.folder.name.split(" ").join("") + "-collapse"}>
                {folders && folders.map((folder) => (
                    <FolderItem key={folder._id} folder={folder} setState={props.setState} state={props.state} setCrumbs={props.setCrumbs} />
                ))}
            </ul>
        </li>
    );
};

export default FolderItem;