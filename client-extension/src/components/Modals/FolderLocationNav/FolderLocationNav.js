import { useEffect, useState } from "react";
import "./FolderLocationNav.css"
import FolderLocationNavItem from "./FolderLocationNavItem";

function FolderLocationNav(props) {
    const [folders, setFolders] = useState(null);

    useEffect(() => {
        chrome.runtime.sendMessage({
            action: "getFolders",
            folder: "main"
        }, (response) => {
            if (response.success) {
                console.log('"main" folders fetched', response.success);
                setFolders(response.success);
            };
        });
    }, []);

    return (
        <div className="container location-container">
            <ul className="list-unstyled ps-0 mb-0">
                {folders && folders.map((folder) => (
                    <FolderLocationNavItem key={folder._id} folder={folder} setState={props.setState} state={props.state}/>
                ))}
            </ul>
        </div>
    );
};

export default FolderLocationNav;