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
            console.log("search in web")
            // chrome.runtime.sendMessage({
            //     action: "searchInWeb",
            //     query: props.searchTerm
            // }, (response) => {
            //     if (response.success) {
            //         console.log('Search results for web (message from client)', response);
            //         props.setWebSearchResults(response.success);
            //         // setError(null);
            //     }
            //     else {
            //         // setError(json.error);
            //     };
            // })
        }
    };

    return (
        <div className="row">
            <div className="search-row">

                <form
                    onSubmit={(e) => e.preventDefault()}
                    role="search">
                    <input className="form-control py-0" type="search" placeholder="Search..." aria-label="Search"
                        value={props.searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        onKeyDown={(e) => (
                            // console.log(e.key)
                            e.key === "Enter" ? handleEnterKey(e) : null
                        )} />
                </form>
                <label className="form-check-label" htmlFor="search-in-web">
                    <input className="form-check-input mx-1"
                        type="checkbox"
                        value=""
                        id="search-in-web"
                        onChange={(e) => setSearchInWeb(e.target.checked)} />
                    Search in web
                </label>
            </div>
        </div>
    );
}

export default SearchBar;