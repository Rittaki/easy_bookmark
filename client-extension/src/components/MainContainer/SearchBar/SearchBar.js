import { useState, useEffect } from "react";

function SearchBar(props) {

    const fetchSearch = (value) => {
        console.log(value);
        chrome.runtime.sendMessage({
            action: "searchBookmarks",
            query: value
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

    const handleSearchChange = (value) => {
        props.setSearchTerm(value);
        fetchSearch(value);
    }

    return (
        <div className="row search-row">

            <form
                onSubmit={(e) => e.preventDefault()}
                role="search">
                <input className="form-control" type="search" placeholder="Search..." aria-label="Search"
                    value={props.searchTerm} onChange={(e) => handleSearchChange(e.target.value)} />
            </form>

        </div>
    );
}

export default SearchBar;