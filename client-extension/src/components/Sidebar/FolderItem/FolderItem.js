import { useEffect, useState } from "react";
import { useAuthContext } from '../../hooks/useAuthContext';
import { useHistoryContext } from "../../hooks/useHistoryContext";
import "./FolderItem.css";

function FolderItem(props) {
    const [folders, setFolders] = useState(null);
    const [toLoad, setToLoad] = useState(false);
    const { user } = useAuthContext();
    const { backStack, forwardStack, handleFolderClick } = useHistoryContext();

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
    }, [toLoad]);

    const updateCurrentFolder = (folder) => {
        props.setState((prevState) => ({ ...prevState, currentFolderToLoad: folder }));
        if (backStack[backStack.length - 1]._id !== folder._id) {
            handleFolderClick(folder);
        }
        updateCrumbs(folder.path);
    };

    return (
        <li className="mb-1 mt-1">
            <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target={"#" + props.folder.name.split(" ").join("") + "-collapse"} aria-expanded="false"
                onClick={() => {
                    setToLoad(true);
                }}>
                <span className="folder-button align-items-center rounded"
                    onClick={() => {
                        updateCurrentFolder(props.folder);
                    }}>
                    {props.folder.name}
                </span>
            </button>
            <ul className="list-unstyled ps-3 collapse" id={props.folder.name.split(" ").join("") + "-collapse"}>
                {folders && folders.map((folder) => (
                    <FolderItem key={folder._id} folder={folder} setState={props.setState} state={props.state} setCrumbs={props.setCrumbs} />
                ))}
            </ul>
        </li>
    );
};

export default FolderItem;