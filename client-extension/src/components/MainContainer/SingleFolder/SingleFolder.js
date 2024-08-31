import { useEffect, useState } from "react";
import "./SingleFolder.css"
import { useHistoryContext } from "../../hooks/useHistoryContext";


function SingleFolder(props) {
    const { backStack, forwardStack, handleFolderClick } = useHistoryContext();
    const [isClicked, setIsClicked] = useState(false);

    const handleBlur = () => {
        setIsClicked(false);
        console.log('blured');
        props.setState((prevState) => ({ ...prevState, currentClickedFolder: null }));
    };

    const updateCrumbs = (newCrumbs) => {
        const crumbs = newCrumbs.split('/').filter((crumb) => crumb !== '');
        console.log('Crumbs:', crumbs);
        props.setCrumbs(crumbs);
    }

    // useEffect(() => {
    //     if (toLoad) {
    //         chrome.runtime.sendMessage({
    //             action: "getFolders",
    //             folder: props.folder.name
    //         }, (response) => {
    //             if (response.success) {
    //                 console.log(`${props.folder.name} folders fetched`, response.success);
    //                 props.setFolders(response.success);
    //                 setToLoad(false);
    //             };
    //         });
    //     };
    // }, [toLoad]);

    const updateCurrentFolder = (folder) => {
        props.setState((prevState) => ({ ...prevState, currentClickedFolder: folder }));
    };

    const updateCurrentFolderToLoad = (folder) => {
        props.setState((prevState) => ({ ...prevState, currentFolderToLoad: folder }));
    };

    let timer = null;

    const onClickHandler = (event) => {
        // event.preventDefault();
        setIsClicked(true);
        clearTimeout(timer);
        if (event.detail === 1) {
            console.log('Clicked once')
            updateCurrentFolder(props.folder.name);
            // Handle single click (e.g., highlight folder)
        } else if (event.detail === 2) {
            // Handle double click (e.g., load new folder)
            // setToLoad(true);
            updateCurrentFolderToLoad(props.folder);
            updateCrumbs(props.folder.path);
            props.setState((prevState) => ({ ...prevState, folderToDelete: null }));
            props.setState((prevState) => ({ ...prevState, currentClickedFolder: null }));
            timer = setTimeout(props.onDoubleClick, 200);
            const folderToHistory = props.folder;
            handleFolderClick(folderToHistory);
        }
    };

    const handleDragStart = (e, folder, type) => {
        console.log('DragStart', e);
        e.dataTransfer.setData("type", type);
        e.dataTransfer.setData("folder", JSON.stringify(folder));
    }

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
                    props.setState((prevState) => ({ ...prevState, reloadAfterAction: !prevState.reloadAfterAction }));
                } else {
                    console.log('Failed to move bookmark', response.error);
                }
            });
        }
    }

    return (
        <div className={`mt-2 me-2 card text-center single-folder ${isClicked ? 'highlighted' : ''}`} >

            <div
                className="flex flex-col flex-1 justify-between p-2"
                onDrop={(e) => { handleOnDrop(e) }}
                onDragOver={(e) => { e.preventDefault(); }}
                draggable onDragStart={(e) => { handleDragStart(e, props.folder, 'folder') }}
                tabIndex={0} onClick={onClickHandler} onBlur={handleBlur}
                onContextMenu={(e) => { props.handleOnContextMenu(e, props.folder, 'folder') }}>

                <img src="resources/folder.png" alt="folder img" loading="lazy" width="100vh" />

                <section className="folder-details">
                    <h6 className="folder-name">{props.folder.name}</h6>
                    <small>{props.folder.linksNumber} links</small>
                </section>
            </div>

        </div>
    );
};

export default SingleFolder;