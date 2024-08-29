import { useState, useEffect } from "react";
import { useAuthContext } from '../../hooks/useAuthContext';
import SingleBookmark from "../SingleBookmark/SingleBookmark";

function BookmarksContainer(props) {
    const [bookmarks, setBookmarks] = useState(null);
    const { user } = useAuthContext();

    useEffect(() => {
        chrome.runtime.sendMessage({
            action: "getBookmarks",
            folder: props.state.currentFolderToLoad.name,
            userId: user.uid
        }, (response) => {
            if (response.success) {
                console.log(`${props.state.currentFolderToLoad.name} bookmarks fetched`, response.success);
                setBookmarks(response.success);
            };
        });
    }, [props.state.currentFolderToLoad, props.state.reloadAfterAction]);

    return (
        <div className="links-container">
            <div className="list-group list-group-flush">
                {bookmarks && bookmarks.map((bookmark) => (
                    <SingleBookmark handleOnContextMenu={props.handleOnContextMenu} key={bookmark._id} bookmark={bookmark} setBookmarks={setBookmarks} setState={props.setState} state={props.state} />
                ))}
            </div>
        </div>
    );
};

export default BookmarksContainer;