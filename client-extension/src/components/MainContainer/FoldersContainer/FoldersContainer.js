import { useState, useEffect } from "react";
import SingleFolder from "../SingleFolder/SingleFolder";
import "./FoldersContainer.css";

function FoldersContainer(props) {
    const [folders, setFolders] = useState(null);
    const [toLoad, setToLoad] = useState(false);

    const handleFolderDoubleClick = () => {
        // Load new folder logic here
        console.log('Double-clicked on folder!');
        // props.setFolderToDelete(null);
        props.setState((prevState) => ({ ...prevState, folderToDelete: null }));
        props.setState((prevState) => ({ ...prevState, currentClickedFolder: null }));
    };

    // useEffect(() => {

    // }, [props.state.isFolderEdited]);

    useEffect(() => {
        chrome.runtime.sendMessage({
            action: "getFolders",
            folder: props.state.currentFolderToLoad
        }, (response) => {
            if (response.success) {
                console.log(`${props.state.currentFolderToLoad} folders fetched`, response.success);
                setFolders(response.success);
                setToLoad(false);
            };
        });
    }, [props.state.currentFolderToLoad, toLoad, props.state.reloadAfterDelete]);

    return (
        <div className="folders-container-right row row-cols-3">
            {folders && folders.map((folder) => (
                <SingleFolder key={folder._id} folder={folder} setFolders={setFolders} setState={props.setState} state={props.state}
                    onDoubleClick={handleFolderDoubleClick} setToLoad={setToLoad}/>
            ))}
        </div>
    );
};

export default FoldersContainer;