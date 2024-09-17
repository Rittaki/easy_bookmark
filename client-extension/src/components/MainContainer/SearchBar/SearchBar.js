import { useAuthContext } from '../../hooks/useAuthContext';
import "./SearchBar.css"
function SearchBar(props) {
    const { user } = useAuthContext();

    const fetchSearch = (value) => {
        console.log(value);
        if (!props.webSearch) {
            console.log("search for bookmarks")
            chrome.runtime.sendMessage({
                action: "searchBookmarks",
                query: value,
                userId: user.uid
            }, (response) => {
                if (response.success) {
                    console.log('Search results for bookmarks (message from client)', response);
                    props.setSearchResults(response.success);
                    // setError(null);
                }
                else {
                    // setError(json.error);
                };
            })
        }
    }

    const handleSearchChange = (value) => {
        props.setSearchTerm(value);
        fetchSearch(value);
    }

    const setSearchInWeb = (checked) => {
        console.log("search in web checked: " + checked);
        props.setWebSearch(checked);
        props.setSearchTerm("");
    };

    const handleEnterKey = (value) => {
        console.log("Enter key pressed: ");
        console.log(value);
        if (props.webSearch) {
            console.log("search in web for folder: " + props.state.currentFolderToLoad._id);
            chrome.runtime.sendMessage({
                action: "searchInWeb",
                query: props.searchTerm,
                folderId: props.state.currentFolderToLoad._id
            }, (response) => {
                if (response.success) {
                    console.log('Search results for web (message from client)', response);
                    props.setWebSearchResults(response.success);
                    // setError(null);
                }
                else {
                    // setError(json.error);
                };
            })
        }
    };

    return (
        <div className="row">
            <div className="search-row" style={{ backgroundColor: '#effdff' }}>

                <form id="search-form"
                    onSubmit={(e) => e.preventDefault()}
                    role="search">
                    <span className="input-group-addon" style={{paddingLeft: '10px'}}><i className="bi bi-search"></i></span>
                    <input className="form-control py-0" id="search-input" type="search" placeholder="" aria-label="Search"
                        value={props.searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        onKeyDown={(e) => (
                            e.key === "Enter" ? handleEnterKey(e) : null
                        )} />
                </form>
                <label className="form-check-label" htmlFor="search-in-web">
                    <input className="form-check-input mx-1"
                        type="checkbox"
                        value=""
                        id="search-in-web"
                        onChange={(e) => setSearchInWeb(e.target.checked)} />
                    <span id='search-web-text' style={{ color: '#38B6FF' }}>Search the web</span>
                </label>
            </div>
        </div>
    );
}

export default SearchBar;