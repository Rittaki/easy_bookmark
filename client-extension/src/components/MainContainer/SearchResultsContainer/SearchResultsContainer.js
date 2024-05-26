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

    const handleFolderOpen = (folder) => {
        console.log("folder to open: " + folder);
        updateCurrentFolderToLoad(folder);
        props.setSearchTerm("");
    };

    const updateCurrentFolderToLoad = (folder) => {
        props.setState((prevState) => ({ ...prevState, currentFolderToLoad: folder }));
    };

    return (
        <div className="search-results-container">
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
                            onClick={() => handleFolderOpen(bookmark.folder)}></i>
                    </div>
                ))}

            </div>
        </div>
    );
}

export default SearchResultsContainer;