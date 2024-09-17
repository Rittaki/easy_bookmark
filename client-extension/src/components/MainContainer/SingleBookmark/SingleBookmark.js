import { useState } from "react";
import "./SingleBookmark.css";

function SingleBookmark(props) {
    const [isClicked, setIsClicked] = useState(false);

    const openInNewTab = (url) => {
        chrome.tabs.create({
            url: url,
            active: false
        })
    };

    const handleBlur = () => {
        setIsClicked(false);
        console.log('blured bookmark');
        props.setState((prevState) => ({ ...prevState, currentClickedBookmark: null }));
    };

    const updateCurrentBookmark = (bookmark) => {
        props.setState((prevState) => ({ ...prevState, currentClickedBookmark: bookmark }));
    };

    const onClickHandler = (event) => {
        setIsClicked(true);
        console.log('Clicked bookmark once')
        updateCurrentBookmark(props.bookmark.title);
    };

    const handleDragStart = (e, bookmark, type) => {
        console.log('DragStart', e);
        e.dataTransfer.setData("type", type);
        e.dataTransfer.setData("bookmark", JSON.stringify(bookmark));
    }

    return (
        <div
            draggable onDragStart={(e) => { handleDragStart(e, props.bookmark, 'bookmark') }}
            onContextMenu={(e) => { props.handleOnContextMenu(e, props.bookmark, "bookmark") }}
            tabIndex={0}
            className={`mt-1 list-group-item d-flex justify-content-between align-items-center single-bookmark
            ${isClicked ? 'highlighted-bookmark' : ''}
            ${props.bookmark.selected ? 'selected' : ''}`}
            onClick={onClickHandler}
            onBlur={handleBlur}>
            <p className="bookmark-title text-truncate">{props.bookmark.title}</p>
            <small className="bookmark-url d-inline-block text-truncate opacity-50 text-nowrap" onClick={() => openInNewTab(props.bookmark.url)}>{props.bookmark.url}</small>
            <small className="opacity-50 text-nowrap">New</small>
        </div>
    );

};

export default SingleBookmark;