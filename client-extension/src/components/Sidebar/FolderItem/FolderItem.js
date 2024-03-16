import { useEffect, useState } from "react";

function FolderItem(props) {
    const [folders, setFolders] = useState(null);
    const [toLoad, setToLoad] = useState(false);

    useEffect(() => {
        if (toLoad) {
            chrome.runtime.sendMessage({
                action: "getFolders",
                folder: props.folder.name
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
        props.setState((prevState) => ({ ...prevState, currentClickedFolder: folder }));
    };

    return (
        <li className="mb-1 mt-1">
            <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target={"#" + props.folder.name.split(" ").join("") + "-collapse"} aria-expanded="false" onClick={() => { setToLoad(true); updateCurrentFolder(props.folder.name);}}>
                {props.folder.name}
            </button>
            <ul className="list-unstyled ps-3 collapse" id={props.folder.name.split(" ").join("") + "-collapse"}>
                {folders && folders.map((folder) => (
                    <FolderItem key={folder._id} folder={folder} setState={props.setState} state={props.state}/>
                ))}
            </ul>
        </li>
    );
};

export default FolderItem;