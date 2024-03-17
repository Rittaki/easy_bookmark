import { useState, useEffect } from "react";
import SingleBookmark from "../SingleBookmark/SingleBookmark";

function BookmarksContainer(props) {
    const [bookmarks, setBookmarks] = useState(null);

    useEffect(() => {
        chrome.runtime.sendMessage({
            action: "getBookmarks",
            folder: props.state.currentClickedFolder
        }, (response) => {
            if (response.success) {
                console.log(`${props.state.currentClickedFolder} bookmarks fetched`, response.success);
                setBookmarks(response.success);
            };
        });
    }, [props.state.currentClickedFolder]);

    return (
        <div className="links-container">
            <div className="list-group list-group-flush">                
                {bookmarks && bookmarks.map((bookmark) => (
                    <SingleBookmark key={bookmark._id} bookmark={bookmark} setBookmarks={setBookmarks} setState={props.setState} state={props.state}/>
                ))}
            </div>
        </div>
    );
};

export default BookmarksContainer;