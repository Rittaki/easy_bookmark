chrome.runtime.onInstalled.addListener(() => {
    console.log('Installed EasyBookmark');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // if (message.action === 'addBookmark') {
    //     const bookmarkToAdd = message.bookmark;
    //     let result = addBookmark(bookmarkToAdd);
    //     result.then(res => sendResponse({ success: res }));
    //     return true;
    // }
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
});

let db = null;

const openDBRequest = indexedDB.open('EasyBookmarkDB', 1);

openDBRequest.onerror = (e) => {
    console.error("An error occurred with IndexedDB");
    console.error(e);
};

openDBRequest.onupgradeneeded = (e) => {
    //1
    // const db = openDBRequest.result;
    db = e.target.result;
    // Create object stores
    const bookmarksStore = db.createObjectStore("bookmarks", { keyPath: "url" });
    const foldersStore = db.createObjectStore('folders', { keyPath: 'folderName' });

    // Create indexes
    bookmarksStore.createIndex('byFolder', ['folderName']);
    bookmarksStore.createIndex('byTitle', ['title']);
    // Create an index for parent-child relationships
    foldersStore.createIndex('byParentFolder', ['parentFolder'], { unique: false });
};

openDBRequest.onsuccess = (e) => {
    db = e.target.result;
    const transactionBookmarks = db.transaction("bookmarks", "readwrite");
    const transactionFolders = db.transaction("folders", "readwrite");

    const foldersStore = transactionFolders.objectStore('folders');
    const bookmarksStore = transactionBookmarks.objectStore('bookmarks');
    const bookmarksByFolderIndex = bookmarksStore.index("byFolder");
    const bookmarksByTitleIndex = bookmarksStore.index("byTitle");
    const foldersByParentIndex = foldersStore.index("byParentFolder");

    // bookmarksStore.put({
    //     url: 'https://example.com', title: 'Example Website', folderName: 'Web Development', timestamp: Date()
    // });
    // bookmarksStore.put({
    //     url: "https://github.com", title: 'GitHub', folderName: 'Web Development', timestamp: Date()
    // });
    // foldersStore.put({
    //     folderName: 'Web Development', parentFolder: 'Education', linksNumber: 2
    // });
    // foldersStore.put({
    //     folderName: 'Education', linksNumber: 0
    // });

    // const bookmarkQuery = bookmarksStore.get("https://github.com");
    // const exampleWebsiteQuery = bookmarksByTitleIndex.getKey(["Example Website"]);
    // const bookmarksByFolderQuery = bookmarksByFolderIndex.getAll(["Web Development"]);
    // const foldersByParentQuery = foldersByParentIndex.getAll(["Education"]);

    // bookmarkQuery.onsuccess = () => {
    //     console.log("Bookmark Query", bookmarkQuery.result);
    // };

    // exampleWebsiteQuery.onsuccess = () => {
    //     console.log("Example Website Query", exampleWebsiteQuery.result);
    // };

    // bookmarksByFolderQuery.onsuccess = () => {
    //     console.log("Bookmarks By Folder Query", bookmarksByFolderQuery.result);
    // };

    // foldersByParentQuery.onsuccess = () => {
    //     console.log("Folders By Parent Folder Query", foldersByParentQuery.result);
    // };
}

// CRUD Operations

// Create a new bookmark
// function addBookmark(bookmark) {
//     // let result = false;
//     if (db) {
//         const transaction = db.transaction('bookmarks', 'readwrite');
//         const store = transaction.objectStore('bookmarks');

//         // return new Promise((resolve, reject) => {
//         //     const request = store.add(bookmark);
//         //     console.log(request);
//         //     request.onerror = () => {
//         //         console.log("Error is: ", request.error);
//         //         // result = false;
//         //         // console.log("Result is: ", result);
//         //         resolve(false);
//         //     };

//         //     request.onsuccess = (e) => {
//         //         e.target.result === bookmark.url
//         //         // console.log("Bookmark " + bookmark.url + " added successfully as: " + e.target.result);
//         //         // result = true;
//         //         // console.log("Result is: ", result);
//         //         resolve(true);
//         //     }
//         // });
//         // const request = store.add(bookmark);
//         // console.log(request);
//         // request.onerror = () =>{
//         //     console.log("Error is: ", request.error);
//         //     result = false;
//         //     console.log("Result is: ", result);
//         // };

//         // request.onsuccess = (e) => {
//         //     e.target.result === bookmark.url
//         //     console.log("Bookmark " + bookmark.url + " added successfully as: " + e.target.result);
//         //     result = true;
//         // }
//         // transaction.oncomplete = () => db.close();
//     };
//     // return result;
// }
// Read bookmarks by folder ID (implement later)

// Update an existing bookmark
function updateBookmark(bookmark) {
    const transaction = db.transaction('bookmarks', 'readwrite');
    const store = transaction.objectStore('bookmarks');
    store.put(bookmark);
    transaction.oncomplete = () => db.close();
}

// Delete a bookmark by ID
function deleteBookmark(bookmarkId) {
    const transaction = db.transaction('bookmarks', 'readwrite');
    const store = transaction.objectStore('bookmarks');
    store.delete(bookmarkId);
    transaction.oncomplete = () => db.close();
}


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
        const response = await fetch(`http://localhost:4000/api/folders/?parentFolder=${folder}`);
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