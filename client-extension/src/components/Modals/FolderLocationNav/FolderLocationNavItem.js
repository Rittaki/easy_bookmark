import { useEffect, useState } from "react";
import { useAuthContext } from '../../hooks/useAuthContext';
import "./FolderLocationNavItem.css"

function FolderLocationNavItem(props) {
    const [folders, setFolders] = useState(null);
    const [toLoad, setToLoad] = useState(false);
    const { user } = useAuthContext();

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

    const updateCurrentLocationFolder = (folder) => {
        props.setState((prevState) => ({ ...prevState, currentClickedLocationFolder: folder }));
    };

    return (
        <li className="mb-1 mt-1">
            <button className="ps-4 btn btn-toggle-location align-items-center collapsed"
                id='folder-list-item'
                data-bs-toggle="collapse" data-bs-target={"#location-" + props.folder.name.split(" ").join("") + "-collapse"}
                aria-expanded="false"
                onFocus={() => { setToLoad(true); updateCurrentLocationFolder(props.folder.name); }}>
                {props.folder.name}
            </button>
            <ul className="list-unstyled ps-3 collapse" id={"location-" + props.folder.name.split(" ").join("") + "-collapse"}>
                {folders && folders.map((folder) => (
                    <FolderLocationNavItem key={folder._id} folder={folder} setState={props.setState} state={props.state} />
                ))}
            </ul>
        </li>
    );
};

export default FolderLocationNavItem;