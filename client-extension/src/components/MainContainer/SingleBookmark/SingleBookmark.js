import { useState, useEffect } from "react";

function SingleBookmark(props) {

    const [toLoad, setToLoad] = useState(false);

    useEffect(() => {
        if (toLoad) {
            chrome.runtime.sendMessage({
                action: "getBookmarks",
                folder: props.folder.name
            }, (response) => {
                if (response.success) {
                    console.log(`${props.folder.name} bookmarks fetched`, response.success);
                    props.setBookmarks(response.success);
                    setToLoad(false);
                };
            });
        };
    }, [toLoad]);

    return (
        <div className="col mb-2">
            <div className="card h-100 text-center bookmark-folder">

                <div className="flex flex-col flex-1 justify-between p-3">
                    <img src="resources/folder.png" alt="folder img" loading="lazy" width="100vh" />
                    <section >
                        <h6 >{props.folder.name}</h6>
                        <small>{props.folder.linksNumber} links</small>
                    </section>
                    <a href="#" className="stretched-link" onClick={() => setToLoad(true)} />
                </div>

            </div>
            <a href="#" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">A list item
                <span className="badge text-bg-primary rounded-pill">New</span>
            </a>
            <a href="#" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">A simple list group item
                <small className="opacity-50 text-nowrap">New</small>
            </a>
            <a href="#" className="list-group-item list-group-item-action">A simple list group item</a>
            <a href="#" className="list-group-item list-group-item-action">A simple list group item</a>
            <a href="#" className="list-group-item list-group-item-action">A simple list group item</a>
        </div>

    );

};

export default SingleBookmark;