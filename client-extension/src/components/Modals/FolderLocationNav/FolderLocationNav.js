import { useEffect, useState } from "react";
import { useAuthContext } from '../../hooks/useAuthContext';
import "./FolderLocationNav.css"
import FolderLocationNavItem from "./FolderLocationNavItem";

function FolderLocationNav(props) {
    const [folders, setFolders] = useState(null);
    const { user } = useAuthContext();

    useEffect(() => {
        chrome.runtime.sendMessage({
            action: "getFolders",
            folder: "Home",
            userId: user.uid
        }, (response) => {
            if (response.success) {
                console.log('"Home" folders fetched', response.success);
                setFolders(response.success);
            };
        });
    }, []);

    return (
        <div className="p-0 container location-container">
            <ul className="list-unstyled ps-0 mb-0">
                {folders && folders.map((folder) => (
                    <FolderLocationNavItem key={folder._id} folder={folder} setState={props.setState} state={props.state}/>
                ))}
            </ul>
        </div>
    );
};

export default FolderLocationNav;