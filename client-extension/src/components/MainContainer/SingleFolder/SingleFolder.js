import { useEffect, useState } from "react";
import "./SingleFolder.css"

function SingleFolder(props) { // implement edit and delete for single folder because for bookmark it's different

    // const [folders, setFolders] = useState(null);
    const [toLoad, setToLoad] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    const handleBlur = () => {
        // add condition "if 'edit' not clicked"
        setIsClicked(false);
        console.log('blured');
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

    let timer = null;

    const onClickHandler = (event) => {
        event.preventDefault();
        setIsClicked(true);
        clearTimeout(timer);
        if (event.detail === 1) {
            console.log('Clicked once')
            // Handle single click (e.g., highlight folder)
        } else if (event.detail === 2) {
            // Handle double click (e.g., load new folder)
            setToLoad(true);
            updateCurrentFolder(props.folder.name);
            timer = setTimeout(props.onDoubleClick, 200);
        }
    };

    return (
            <div className={`mt-2 me-2 card text-center single-folder ${isClicked ? 'highlighted' : ''}`}>
            
                <div className="flex flex-col flex-1 justify-between p-2" onClick={onClickHandler} onBlur={handleBlur}>
                    <img src="resources/folder.png" alt="folder img" loading="lazy" width="100vh" />
                    <section className="folder-details">
                        <h6 className="folder-name">{props.folder.name}</h6>
                        <small>{props.folder.linksNumber} links</small>
                    </section>
                    {/**<a href="#" className="stretched-link" onClick={() => { setToLoad(true); updateCurrentFolder(props.folder.name);}}/>**/}
                    <a href="#" className={`stretched-link`}/>
                </div>
                
            </div>
    );
};

export default SingleFolder;