import { useState } from "react";
import "./SearchResultsContainer.css"

function SearchResultsContainer(props) {
    const splitRegex = new RegExp(props.searchTerm, "i");
    // const match = props.searchResults.match(splitRegex);

    const openInNewTab = (url) => {
        chrome.tabs.create({
            url: url,
            active: false
        })
    };

    const handleFolderOpen = (bookmark) => {
        console.log("folder to open: " + bookmark.folder);
        const crumbs = bookmark.path.split('/').filter((crumb) => crumb !== '');
        if (crumbs.length > 0) {
            crumbs.pop();
        }
        // crumbs = crumbs.slice(0, -1);
        props.setCrumbs(crumbs);
        updateCurrentFolderToLoad(bookmark.folder);
        props.setSearchTerm("");
    };

    const updateCurrentFolderToLoad = (folder) => {
        props.setState((prevState) => ({ ...prevState, currentFolderToLoad: folder }));
    };

 
    // if serach in web checked, then create condition that load another div that maps search results (not like bookmarks)

    return (
        <div className="search-results-container">

            {props.webSearch ?
                <div className="web-search-results">
                    Web search is ON
                </div>
                :
                <div className="list-group list-group-flush">
                    {props.searchResults && props.searchResults.map((bookmark) => (
                        <div
                            tabIndex={0}
                            key={bookmark._id}
                            className="mt-1 list-group-item d-flex justify-content-between align-items-center search-bookmark">
                            <p className="bookmark-title text-truncate">
                                {bookmark.title.split(splitRegex).map((word, index) => (
                                    index > 0 ? (
                                        <span key={index}>
                                            <span style={{ color: '#000000', fontWeight: 700 }}>
                                                {bookmark.title.match(splitRegex)[0] || ''}
                                            </span>
                                            {word}
                                        </span>
                                    ) : (
                                        word
                                    )
                                ))}
                            </p>
                            <small className="bookmark-url d-inline-block text-truncate opacity-50 text-nowrap"
                                onClick={() => openInNewTab(bookmark.url)}>
                                {bookmark.url.split(splitRegex).map((word, index) => (
                                    index > 0 ? (
                                        <span key={index}>
                                            <span style={{ color: '#000000', fontWeight: 700 }}>
                                                {bookmark.url.match(splitRegex)[0] || ''}
                                            </span>
                                            {word}
                                        </span>
                                    ) : (
                                        word
                                    )
                                ))}
                            </small>
                            <i className="fs-5 folder-link-icon bi bi-folder-symlink text-primary"
                                onClick={() => handleFolderOpen(bookmark)}></i>
                        </div>
                    ))}

                </div>
            }
        </div>
    );
}

export default SearchResultsContainer;