import { useHistoryContext } from "../../hooks/useHistoryContext";
import "./SearchResultsContainer.css";

function SearchResultsContainer(props) {
    const { backStack, forwardStack, handleFolderClick } = useHistoryContext();
    const splitRegex = new RegExp(props.searchTerm, "i");

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
        props.setCrumbs(crumbs);
        chrome.runtime.sendMessage({
            action: "getFolderByName",
            folderName: bookmark.folder
        }, (response) => {
            if (response.success) {
                console.log(`${bookmark.folder} folder detailes fetched`, response.success);
                updateCurrentFolderToLoad(response.success[0]);
            };
        });
    };

    const updateCurrentFolderToLoad = (newFolder) => {
        props.setState((prevState) => ({ ...prevState, currentFolderToLoad: newFolder }));
        handleFolderClick(newFolder);
        props.setSearchTerm("");
    };

    return (
        <div className="search-results-container">

            {props.webSearch ?
                <div className="list-group list-group-flush web-search-results">
                    {!props.webSearchResults ?
                        <div style={{ marginTop: '150px' }} className="d-flex justify-content-center">
                            <div className="spinner-grow"
                                style={{ width: '200px', height: '200px', color: '#c0edf4' }}
                                role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div> : <div></div>}
                    {
                        props.webSearchResults && props.webSearchResults.map((result, index) => (
                            <div key={index} className="mt-1 list-group-item d-flex justify-content-between align-items-left web-search-result">
                                <a href={result.link} target="_blank" rel="noreferrer" id="result-link">
                                    <h6 className="m-0" dangerouslySetInnerHTML={{ __html: result.htmlTitle }}></h6>
                                </a>
                                <small dangerouslySetInnerHTML={{ __html: result.htmlFormattedUrl }}></small>
                                <p className="mb-0" id="result-description" dangerouslySetInnerHTML={{ __html: result.htmlSnippet }}></p>

                            </div>
                        ))
                    }
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
                                            <span style={{ color: '#0C7FDA', fontWeight: 700 }}>
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
                                            <span style={{ color: '#0C7FDA', fontWeight: 700 }}>
                                                {bookmark.url.match(splitRegex)[0] || ''}
                                            </span>
                                            {word}
                                        </span>
                                    ) : (
                                        word
                                    )
                                ))}
                            </small>
                            <i className="fs-5 folder-link-icon bi bi-folder-symlink"
                                onClick={() => handleFolderOpen(bookmark)}></i>
                        </div>
                    ))}

                </div>
            }
        </div>
    );
}

export default SearchResultsContainer;