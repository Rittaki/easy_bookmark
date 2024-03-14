import { useEffect, useState } from "react";

function FolderItem(props) {
    const [folders, setFolders] = useState(null);
    const [toLoad, setToLoad] = useState(false);

    useEffect(() => {
        if (toLoad) {
            const fetchFolders = async () => {
                const response = await fetch([`http://localhost:4000/api/folders/?parentFolder=${props.folder.name}`]);
                const json = await response.json();

                if (response.ok) {
                    setFolders(json);
                };
            };

            fetchFolders();
        };
    }, [toLoad]);

    return (
        <li className="mb-1 mt-1">
            <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target={"#" + props.folder.name.split(" ").join("") + "-collapse"} aria-expanded="false" onClick={() => setToLoad(true)}>
                {props.folder.name}
            </button>
            <ul className="list-unstyled ps-3 collapse" id={props.folder.name.split(" ").join("") + "-collapse"}>
                {folders && folders.map((folder) => (
                    <FolderItem key={folder._id} folder={folder} />
                ))}
            </ul>
        </li>
    );
};

export default FolderItem;