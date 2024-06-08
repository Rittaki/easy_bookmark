import { useEffect, useState } from "react";

import FolderItem from "../FolderItem/FolderItem";

function FoldersList(props) {
    const [folders, setFolders] = useState(null);

    useEffect(() => {
        chrome.runtime.sendMessage({
            action: "getFolders",
            folder: "Home"
        }, (response) => {
            if (response.success) {
                console.log('"Home" folders fetched', response.success);
                setFolders(response.success);
                props.setState((prevState) => ({ ...prevState, isFolderEdited: false }))
            };
        });
    }, [props.state.isFolderEdited, props.state.reloadAfterAction]);

    return (
        <aside id="sidebar" className="sidebar">
            <ul className="list-unstyled ps-0">
                {folders && folders.map((folder) => (
                    <FolderItem key={folder._id} folder={folder} setState={props.setState} state={props.state} setCrumbs={props.setCrumbs} />
                ))}
            </ul>
        </aside>
    );
};

export default FoldersList;