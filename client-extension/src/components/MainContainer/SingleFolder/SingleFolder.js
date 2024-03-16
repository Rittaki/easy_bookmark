import { useEffect, useState } from "react";

function SingleFolder(props) {

    // const [folders, setFolders] = useState(null);
    const [toLoad, setToLoad] = useState(false);

    useEffect(() => {
        if (toLoad) {
            chrome.runtime.sendMessage({
                action: "getFolders",
                folder: props.folder.name
            }, (response) => {
                if (response.success) {
                    console.log(`${props.folder.name} folders fetched`, response.success);
                    props.setFolders(response.success);
                    setToLoad(false);
                };
            });
        };
    }, [toLoad]);

    const updateCurrentFolder = (folder) => {
        props.setState((prevState) => ({ ...prevState, currentClickedFolder: folder }));
    };

    return (
        <div className="col mb-2">
            <div className="card h-100 text-center bookmark-folder">
            
                <div className="flex flex-col flex-1 justify-between p-3">
                    <img src="resources/folder.png" alt="folder img" loading="lazy" width="100vh" />
                    <section >
                        <h6 >{props.folder.name}</h6>
                        <small>{props.folder.linksNumber} links</small>
                    </section>
                    <a href="#" className="stretched-link" onClick={() => { setToLoad(true); updateCurrentFolder(props.folder.name);}}/>
                </div>
                
            </div>
        </div>
    );
};

export default SingleFolder;