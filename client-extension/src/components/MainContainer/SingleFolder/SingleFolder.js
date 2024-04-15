import { useEffect, useState } from "react";
import "./SingleFolder.css"

function SingleFolder(props) {
    const [isClicked, setIsClicked] = useState(false);

    const handleBlur = () => {
        setIsClicked(false);
        console.log('blured');
        props.setState((prevState) => ({ ...prevState, currentClickedFolder: null }));
    };

    // useEffect(() => {
    //     if (toLoad) {
    //         chrome.runtime.sendMessage({
    //             action: "getFolders",
    //             folder: props.folder.name
    //         }, (response) => {
    //             if (response.success) {
    //                 console.log(`${props.folder.name} folders fetched`, response.success);
    //                 props.setFolders(response.success);
    //                 setToLoad(false);
    //             };
    //         });
    //     };
    // }, [toLoad]);

    const updateCurrentFolder = (folder) => {
        props.setState((prevState) => ({ ...prevState, currentClickedFolder: folder }));
    };

    const updateCurrentFolderToLoad = (folder) => {
        props.setState((prevState) => ({ ...prevState, currentFolderToLoad: folder }));
    };

    let timer = null;

    const onClickHandler = (event) => {
        // event.preventDefault();
        setIsClicked(true);
        clearTimeout(timer);
        if (event.detail === 1) {
            console.log('Clicked once')
            updateCurrentFolder(props.folder.name);
            // Handle single click (e.g., highlight folder)
        } else if (event.detail === 2) {
            // Handle double click (e.g., load new folder)
            // setToLoad(true);
            updateCurrentFolderToLoad(props.folder.name);
            props.setState((prevState) => ({ ...prevState, folderToDelete: null }));
            props.setState((prevState) => ({ ...prevState, currentClickedFolder: null }));
            timer = setTimeout(props.onDoubleClick, 200);
        }
    };

    return (
        <div className={`mt-2 me-2 card text-center single-folder ${isClicked ? 'highlighted' : ''}`} >

            <div className="flex flex-col flex-1 justify-between p-2" tabIndex={0} onClick={onClickHandler} onBlur={handleBlur}
                onContextMenu={(e) => { props.handleOnContextMenu(e, props.folder, 'folder') }}>
                
                    <img src="resources/folder.png" alt="folder img" loading="lazy" width="100vh" />
                
                <section className="folder-details">
                    <h6 className="folder-name">{props.folder.name}</h6>
                    <small>{props.folder.linksNumber} links</small>
                </section>
            </div>

        </div>
    );
};

export default SingleFolder;