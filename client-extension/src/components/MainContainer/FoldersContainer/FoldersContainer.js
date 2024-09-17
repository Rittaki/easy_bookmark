
import { useState, useEffect } from "react";
import { useAuthContext } from '../../hooks/useAuthContext';
import SingleFolder from "../SingleFolder/SingleFolder";
import "./FoldersContainer.css";

function FoldersContainer(props) {
    const [folders, setFolders] = useState(null);
    const [toLoad, setToLoad] = useState(false);
    const { user } = useAuthContext();

    const handleFolderDoubleClick = () => {
        console.log('Double-clicked on folder!');
        props.setState((prevState) => ({ ...prevState, folderToDelete: { _id: "", name: "" } }));
        props.setState((prevState) => ({ ...prevState, currentClickedFolder: null }));
    };

    useEffect(() => {
        console.log("ASKING FOR FOLDER: " + props.state.currentFolderToLoad.name);
        const updatedFolder = props.state.currentFolderToLoad;
        chrome.runtime.sendMessage({
            action: "getFolders",
            folder: updatedFolder.name,
            userId: user.uid
        }, (response) => {
            if (response.success) {
                console.log(`${props.state.currentFolderToLoad.name} folders fetched`, response.success);
                setFolders(response.success);
                setToLoad(false);
            };
        });
    }, [props.state.currentFolderToLoad, toLoad, props.state.reloadAfterAction]);

    return (
        <div className="folders-container-right row row-cols-3">
            {folders && folders.map((folder) => (
                <SingleFolder key={folder._id} folder={folder} setFolders={setFolders} setState={props.setState} state={props.state}
                    onDoubleClick={handleFolderDoubleClick} setToLoad={setToLoad} handleOnContextMenu={props.handleOnContextMenu} setCrumbs={props.setCrumbs} />
            ))}
        </div>
    );
};

export default FoldersContainer;