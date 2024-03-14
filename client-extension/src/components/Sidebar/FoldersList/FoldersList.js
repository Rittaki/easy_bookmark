import { useEffect, useState } from "react";

import FolderItem from "../FolderItem/FolderItem";

function FoldersList() {
    const [folders, setFolders] = useState(null);

    // useEffect(() => {
    //     chrome.runtime.sendMessage({
    //         action: "getFolders",
    //         folder: "main"
    //     }, (response) => {
    //         if (response.success) {
    //             console.log('"main" folders fetched', response);
    //         };
    //     });
    // }, []);

    useEffect(() => {
        const fetchFolders = async () => {
            const response = await fetch('http://localhost:4000/api/folders/?parentFolder=main');
            const json = await response.json();

            if (response.ok) {
                setFolders(json);
            };
        };

        fetchFolders();
    }, []);

    return (
        <aside id="sidebar" className="sidebar">
            <ul className="list-unstyled ps-0">
                {folders && folders.map((folder) => (
                    <FolderItem key={folder._id} folder={folder}/>
                ))}
            </ul>
        </aside>
    );
};

export default FoldersList;