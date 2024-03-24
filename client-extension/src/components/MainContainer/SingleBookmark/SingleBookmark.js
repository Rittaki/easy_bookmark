import { useState, useEffect } from "react";
import "./SingleBookmark.css"

function SingleBookmark(props) {
    const openInNewTab = (url) => {
        chrome.tabs.create({
            url: url,
            active: false
        })
    };


    return (
        <a href="#" className="mt-1 list-group-item list-group-item-action d-flex justify-content-between align-items-center" onClick={() => openInNewTab(props.bookmark.url)}>
            <p className="bookmark-title text-truncate">{props.bookmark.title}</p>
            <small className="bookmark-url d-inline-block text-truncate opacity-50 text-nowrap" >{props.bookmark.url}</small>
            <small className="opacity-50 text-nowrap">New</small>
        </a>
    );

};

export default SingleBookmark;