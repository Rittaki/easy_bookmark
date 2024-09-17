chrome.contextMenus.removeAll();

chrome.runtime.onInstalled.addListener(async () => {
    console.log('Installed EasyBookmark');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getFolderByName') {
        console.log(message);
        const name = message.folderName;
        let result = fetchFolderByName(name);
        result.then(res => sendResponse({ success: res }));
        return true;
    }
    if (message.action === 'getFolders') {
        console.log(message);
        const parentFolder = message.folder;
        const userId = message.userId;
        let result = fetchFolders(parentFolder, userId);
        result.then(res => sendResponse({ success: res }));
        return true;
    }
    if (message.action === 'getBookmarks') {
        console.log(message);
        const folder = message.folder;
        const userId = message.userId;
        let result = fetchBookmarks(folder, userId);
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
    if (message.action === 'moveBookmark') {
        console.log(message);
        const bookmarkToUpdate = JSON.parse(message.bookmark);
        const newFolder = JSON.parse(message.folder);
        let result = moveBookmark(bookmarkToUpdate, newFolder);
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
    if (message.action === 'moveFolder') {
        console.log(message);
        const folderToUpdate = JSON.parse(message.folder);
        const newParent = JSON.parse(message.newParent);
        let result = moveFolder(folderToUpdate, newParent);
        result.then(res => sendResponse({ success: res }));
        return true;
    }
    if (message.action === 'deleteFolder') {
        console.log(message);
        const folderToDelete = message.folder;
        const folderIdToDelete = message.folderId;
        let result = deleteFolder(folderToDelete, folderIdToDelete);
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
        const userId = message.userId;
        let result = suggestFolders(url, userId);
        result.then(res => sendResponse({ success: res }));
        return true;
    }
    if (message.action === 'searchBookmarks') {
        console.log(message);
        const query = message.query;
        const userId = message.userId;
        let result = searchBookmarks(query, userId);
        result.then(res => sendResponse({ success: res }));
        return true;
    }
    if (message.action === 'createUser') {
        console.log('got createUser in background', message);
        const user = message.user;
        let result = createUser(user);
        result.then(res => sendResponse({ success: res }));
        return true;
    }
    if (message.action === 'searchInWeb') {
        console.log('searchInWeb in background', message);
        const query = message.query;
        const folderId = message.folderId;
        let result = searchInWeb(query, folderId);
        result.then(res => sendResponse({ success: res }));
        return true;
    }
});

async function searchInWeb(query, folderId) {
    try {
        const response = await fetch('http://localhost:4000/api/web_search', {
            method: "POST",
            body: JSON.stringify({ query: query, folderId: folderId }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
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

async function createUser(user) {
    try {
        const response = await fetch("http://localhost:4000/api/users/register", {
            method: "POST",
            body: JSON.stringify(user),
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
            console.log("User added (message from background)", json);
            return json;
        }
    } catch (error) {
        console.error(error);
    }
}
// CRUD Operations

async function fetchFolders(parentFolder, userId) {
    try {
        const response = await fetch(`http://localhost:4000/api/folders/?parentFolder=${parentFolder}&userId=${userId}`);
        if (response.ok) {
            const json = await response.json();
            return json;
        }
    } catch (error) {
        console.error(error);
    }
};

async function fetchFolderByName(name) {
    try {
        const response = await fetch(`http://localhost:4000/api/folders/?name=${name}`);
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

async function fetchBookmarks(folder, userId) {
    try {
        const response = await fetch(`http://localhost:4000/api/bookmarks/?folder=${folder}&userId=${userId}`);
        console.log(response);
        if (response.ok) {
            const json = await response.json();
            return json;
        }
    } catch (error) {
        console.error(error);
    }
};

async function searchBookmarks(query, userId) {
    try {
        const response = await fetch(`http://localhost:4000/api/bookmarks/search?searchTerm=${query}&userId=${userId}`);
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
        console.log("INSIDE ADD BOOKMARK");
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

async function moveBookmark(bookmarkToUpdate, newFolder) {
    try {
        console.log("Bookmark id:", bookmarkToUpdate._id);
        const response = await fetch(`http://localhost:4000/api/bookmarks/${bookmarkToUpdate._id}`);
        console.log(response);
        if (!response.ok) {
            console.log(json.error);
            return json.error;
        }
        if (response.ok) {
            const patchResponse = await fetch(`http://localhost:4000/api/bookmarks/${bookmarkToUpdate._id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    folder: newFolder.name,
                    path: newFolder.path + `/${newFolder.name}`
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
    } catch (error) {
        console.error(error);
    }
};

async function moveFolder(folderToUpdate, newParent) {
    try {
        console.log("Folder id:", folderToUpdate._id);
        const response = await fetch(`http://localhost:4000/api/folders/${folderToUpdate._id}`);
        console.log(response);
        if (!response.ok) {
            console.log(json.error);
            return json.error;
        }
        if (response.ok) {
            const patchResponse = await fetch(`http://localhost:4000/api/folders/${folderToUpdate._id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    parentFolder: newParent.name,
                    path: newParent.path + `/${newParent.name}`
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

async function deleteFolder(folder, folderId) {
    try {
        const response = await fetch(`http://localhost:4000/api/folders/${folderId}`);
        console.log(response);
        if (!response.ok) {
            console.log(json.error);
            return json.error;
        }
        if (response.ok) {
            const json = await response.json();
            console.log(json);
            const deleteResponse = await fetch(`http://localhost:4000/api/folders/${folderId}`, {
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

async function suggestFolders(url, userId) {
    try {
        const response = await fetch("http://localhost:4000/api/chatgpt/suggest_folder", {
            method: "POST",
            body: JSON.stringify({ url, userId }),
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
