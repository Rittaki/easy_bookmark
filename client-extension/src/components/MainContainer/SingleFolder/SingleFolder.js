import { useEffect, useState } from "react";
import "./SingleFolder.css"

function SingleFolder(props) { // implement edit and delete for single folder because for bookmark it's different
    const [text, setText] = useState(props.folder.name);
    const [isClicked, setIsClicked] = useState(false);
    const [showInputElement, setShowInputElement] = useState(false);
    const [isEnterClicked, setIsEnterClicked] = useState(false);

    useEffect(() => {
        if (isEnterClicked) {
            console.log("Enter clicked");
            chrome.runtime.sendMessage({
                action: "updateFolder",
                folder: props.folder.name,
                newName: text
            }, (response) => {
                if (response.success) {
                    console.log("Folder updated successfully (from react)");
                    props.setState((prevState) => ({ ...prevState, isFolderEdited: true }));
                    props.setToLoad(true);
                };
            });
            setIsEnterClicked(false);
        }
    }, [isEnterClicked]);

    const handleFolderNameDoubleClick = () => {
        setShowInputElement(true);
    };

    const handleChange = (event) => {
        console.log("handleChange");
        setText(event.target.value);
    };

    const handleInputEnter = () => {
        console.log("enter input");
        handleTextBlur();
        setIsEnterClicked(true);
        // Save the changes or perform any required actions here
    };

    const handleTextBlur = () => {
        console.log("inside handleTextBlur");
        setShowInputElement(false);
        console.log(text);
    };

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
            timer = setTimeout(props.onDoubleClick, 200);
        }
    };

    return (
        <div className={`mt-2 me-2 card text-center single-folder ${isClicked ? 'highlighted' : ''}`} >

            <div className="flex flex-col flex-1 justify-between p-2">
                <div tabIndex={0} className="clickable" onMouseDown={onClickHandler} onBlur={handleBlur}>
                    <img src="resources/folder.png" alt="folder img" loading="lazy" width="100vh" />
                </div>
                <section className="folder-details">
                    {showInputElement ? (
                        <input
                            autoFocus
                            type="text"
                            value={text}
                            onChange={handleChange}
                            onBlur={handleTextBlur}
                            onKeyDown={(e) => {
                                if (e.key === "Enter")
                                    handleInputEnter();
                            }}
                        ></input>
                    ) : (
                        <h6 className="folder-name" onDoubleClick={handleFolderNameDoubleClick}
                        >{props.folder.name}</h6>
                    )}

                    <small>{props.folder.linksNumber} links</small>
                </section>
                {/**<a href="#" className="stretched-link" onClick={() => { setToLoad(true); updateCurrentFolder(props.folder.name);}}/>**/}
                {/**<a href="#" className={`stretched-link`} />**/}
            </div>

        </div>
    );
};

export default SingleFolder;