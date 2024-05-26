chrome.contextMenus.removeAll();

// chrome.contextMenus.create({
//     id: "edit",
//     title: "Edit",
//     contexts: ["page"],
//     documentUrlPatterns: ["chrome-extension://cfphhjfddchkkhgpejnnniiclphbcjie/popup.html"]
// });

// chrome.contextMenus.onClicked.addListener((info, tab) => {
//     if (info.menuItemId === "edit") {
//       // Check if the right-clicked element is an anchor with the desired class

//     }
//   });

chrome.runtime.onInstalled.addListener(async () => {
    console.log('Installed EasyBookmark');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getFolders') {
        console.log(message);
        const parentFolder = message.folder;
        let result = fetchFolders(parentFolder);
        result.then(res => sendResponse({ success: res }));
        return true;
    }
    if (message.action === 'getBookmarks') {
        console.log(message);
        const folder = message.folder;
        let result = fetchBookmarks(folder);
        result.then(res => sendResponse({ success: res }));
        return true;
    }
    if (message.action === 'addBookmark') {
        console.log(message);
        const bookmarkToAdd = message.bookmark;
        let result = addBookmark(bookmarkToAdd);
        result.then(res => sendResponse({ success: res }));
        return true;
    }
    if (message.action === 'updateBookmark') {
        console.log(message);
        const bookmarkToUpdate = message.bookmark;
        const newBookmarkTitle = message.newTitle;
        const newBookmarkUrl = message.newUrl;
        let result = updateBookmark(bookmarkToUpdate, newBookmarkTitle, newBookmarkUrl);
        result.then(res => sendResponse({ success: res }));
        return true;
    }
    if (message.action === 'deleteBookmark') {
        console.log(message);
        const bookmarkToDelete = message.bookmark;
        let result = deleteBookmark(bookmarkToDelete);
        result.then(res => sendResponse({ success: res }));
        return true;
    }
    if (message.action === 'addFolder') {
        console.log(message);
        const folderToAdd = message.folder;
        let result = addFolder(folderToAdd);
        result.then(res => sendResponse({ success: res }));
        return true;
    }
    if (message.action === 'updateFolder') {
        console.log(message);
        const folderToUpdate = message.folder;
        const newFolderName = message.newName;
        let result = updateFolder(folderToUpdate, newFolderName);
        result.then(res => sendResponse({ success: res }));
        return true;
    }
    if (message.action === 'deleteFolder') {
        console.log(message);
        const folderToDelete = message.folder;
        let result = deleteFolder(folderToDelete);
        result.then(res => sendResponse({ success: res }));
        return true;
    }
    if (message.action === 'generateTitles') {
        console.log(message);
        const url = message.url;
        let result = generateTitles(url);
        result.then(res => sendResponse({ success: res }));
        return true;
    }
    if (message.action === 'generateFolders') {
        console.log(message);
        const url = message.url;
        let result = generateFolders(url);
        result.then(res => sendResponse({ success: res }));
        return true;
    }
    if (message.action === 'suggestFolders') {
        console.log(message);
        const url = message.url;
        let result = suggestFolders(url);
        result.then(res => sendResponse({ success: res }));
        return true;
    }
    if (message.action === 'searchBookmarks') {
        console.log(message);
        const query = message.query;
        let result = searchBookmarks(query);
        result.then(res => sendResponse({ success: res }));
        return true;
    }
});

// CRUD Operations

// works somehow
async function fetchFolders(parentFolder) {
    try {
        const response = await fetch(`http://localhost:4000/api/folders/?parentFolder=${parentFolder}`);
        console.log(response);
        if (response.ok) {
            const json = await response.json();
            console.log(json);
            return json;
        }
    } catch (error) {
        console.error(error);
    }
};

async function fetchBookmarks(folder) {
    try {
        const response = await fetch(`http://localhost:4000/api/bookmarks/?folder=${folder}`);
        console.log(response);
        if (response.ok) {
            const json = await response.json();
            console.log(json);
            return json;
        }
    } catch (error) {
        console.error(error);
    }
};

async function searchBookmarks(query) {
    try {
        const response = await fetch(`http://localhost:4000/api/bookmarks/search?searchTerm=${query}`);
        console.log(response);
        if (response.ok) {
            const json = await response.json();
            console.log("Search results bookmarks (message from background)", json);
            return json;
        }
    } catch (error) {
        console.error(error);
    }
}

async function addBookmark(newBookmark) {
    try {
        const response = await fetch("http://localhost:4000/api/bookmarks", {
            method: "POST",
            body: JSON.stringify(newBookmark),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json = await response.json();

        if (!response.ok) {
            console.log(json.error);
            return json.error;
        }
        if (response.ok) {
            console.log("Bookmark added (message from background)", json);
            return json;
        }
    } catch (error) {
        console.error(error);
    }
};

async function updateBookmark(oldUrl, newTitle, newUrl) {
    try {
        const response = await fetch(`http://localhost:4000/api/bookmarks/?url=${oldUrl}`);
        console.log(response);
        if (!response.ok) {
            console.log(json.error);
            return json.error;
        }
        if (response.ok) {
            const json = await response.json();
            console.log(json[0]);
            const patchResponse = await fetch(`http://localhost:4000/api/bookmarks/${json[0]._id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    title: newTitle,
                    url: newUrl
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const patchJson = await patchResponse.json();

            if (!response.ok) {
                console.log(patchJson.error);
                return patchJson.error;
            }
            if (response.ok) {
                console.log("Folder updated (message from background)", patchJson);
                return patchJson;
            }
        }
 
    } catch (error) {
        console.error(error);
    }
};

async function deleteBookmark(bookmark) {
    try {
        const response = await fetch(`http://localhost:4000/api/bookmarks/?title=${bookmark}`);
        console.log(response);
        if (!response.ok) {
            console.log(json.error);
            return json.error;
        }
        if (response.ok) {
            const json = await response.json();
            console.log(json[0]);
            const deleteResponse = await fetch(`http://localhost:4000/api/bookmarks/${json[0]._id}`, {
                method: "DELETE"
            });
            const deleteJson = await deleteResponse.json();

            if (!response.ok) {
                console.log(deleteJson.error);
                return deleteJson.error;
            }
            if (response.ok) {
                console.log("Bookmark deleted (message from background)", deleteJson);
                return deleteJson;
            }
        }

    } catch (error) {
        console.error(error);
    }
};

async function addFolder(newFolder) {
    try {
        const response = await fetch("http://localhost:4000/api/folders", {
            method: "POST",
            body: JSON.stringify(newFolder),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json = await response.json();

        if (!response.ok) {
            console.log(json.error);
            return json.error;
        }
        if (response.ok) {
            console.log("Folder added (message from background)", json);
            return json;
        }
    } catch (error) {
        console.error(error);
    }
};

async function updateFolder(oldName, newName) {
    try {
        const response = await fetch(`http://localhost:4000/api/folders/?name=${oldName}`);
        console.log(response);
        if (!response.ok) {
            console.log(json.error);
            return json.error;
        }
        if (response.ok) {
            const json = await response.json();
            console.log(json[0]);
            // let folderToUpdate = json[0];
            // folderToUpdate['name'] = newName;
            // console.log(folderToUpdate);
            const patchResponse = await fetch(`http://localhost:4000/api/folders/${json[0]._id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    name: newName,
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const patchJson = await patchResponse.json();

            if (!response.ok) {
                console.log(patchJson.error);
                return patchJson.error;
            }
            if (response.ok) {
                console.log("Folder updated (message from background)", patchJson);
                return patchJson;
            }
        }
        // const response = await fetch("http://localhost:4000/api/folders", {
        //     method: "POST",
        //     body: JSON.stringify(oldName),
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // });
        // const json = await response.json();

        // if (!response.ok) {
        //     console.log(json.error);
        //     return json.error;
        // }
        // if (response.ok) {
        //     console.log("Folder added (message from background)", json);
        //     return json;
        // }
    } catch (error) {
        console.error(error);
    }
};

async function deleteFolder(folder) {
    try {
        const response = await fetch(`http://localhost:4000/api/folders/?name=${folder}`);
        console.log(response);
        if (!response.ok) {
            console.log(json.error);
            return json.error;
        }
        if (response.ok) {
            const json = await response.json();
            console.log(json[0]);
            const deleteResponse = await fetch(`http://localhost:4000/api/folders/${json[0]._id}`, {
                method: "DELETE"
            });
            const deleteJson = await deleteResponse.json();

            if (!response.ok) {
                console.log(deleteJson.error);
                return deleteJson.error;
            }
            if (response.ok) {
                console.log("Folder deleted (message from background)", deleteJson);
                return deleteJson;
            }
        }

    } catch (error) {
        console.error(error);
    }
};

async function generateTitles(url) {
    try {
        const response = await fetch("http://localhost:4000/api/chatgpt/generate_title", {
            method: "POST",
            body: JSON.stringify({ url }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json = await response.json();

        if (!response.ok) {
            console.log(json.error);
            return json.error;
        }
        if (response.ok) {
            console.log("Titles generated (message from background)", json);
            return json;
        }
    } catch (error) {
        console.error(error);
    }
};

async function generateFolders(url) {
    try {
        const response = await fetch("http://localhost:4000/api/chatgpt/generate_folder", {
            method: "POST",
            body: JSON.stringify({ url }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json = await response.json();

        if (!response.ok) {
            console.log(json.error);
            return json.error;
        }
        if (response.ok) {
            console.log("Folders generated (message from background)", json);
            return json;
        }
    } catch (error) {
        console.error(error);
    }
}

async function suggestFolders(url) {
    try {
        const response = await fetch("http://localhost:4000/api/chatgpt/suggest_folder", {
            method: "POST",
            body: JSON.stringify({ url }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json = await response.json();

        if (!response.ok) {
            console.log(json.error);
            return json.error;
        }
        if (response.ok) {
            console.log("Folders suggested (message from background)", json);
            return json;
        }
    } catch (error) {
        console.error(error);
    }
}
