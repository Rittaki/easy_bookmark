import { useState, useEffect } from "react";
import "./SingleBookmark.css"

function SingleBookmark(props) {

    return (
        <a href="#" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">{props.bookmark.title}
            <small className="bookmark-url d-inline-block text-truncate opacity-50 text-nowrap" >{props.bookmark.url}</small>
            <small className="opacity-50 text-nowrap">New</small>
        </a>
    );

};

export default SingleBookmark;