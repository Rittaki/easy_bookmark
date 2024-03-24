import { useState, useEffect } from "react";
import SingleFolder from "../SingleFolder/SingleFolder";
import "./FoldersContainer.css";

function FoldersContainer(props) {
    const [folders, setFolders] = useState(null);

    const handleFolderDoubleClick = () => {
        // Load new folder logic here
        console.log('Double-clicked on folder!');
    };

    useEffect(() => {
        chrome.runtime.sendMessage({
            action: "getFolders",
            folder: props.state.currentClickedFolder
        }, (response) => {
            if (response.success) {
                console.log(`${props.state.currentClickedFolder} folders fetched`, response.success);
                setFolders(response.success);
            };
        });
    }, [props.state.currentClickedFolder]);

    return (
        <div className="folders-container-right row row-cols-3">
            {folders && folders.map((folder) => (
                <SingleFolder key={folder._id} folder={folder} setFolders={setFolders} setState={props.setState} state={props.state} onDoubleClick={handleFolderDoubleClick}/>
            ))}
        </div>
    );
};

export default FoldersContainer;