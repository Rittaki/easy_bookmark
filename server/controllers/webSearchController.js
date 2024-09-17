const axios = require('axios');

const Folder = require('../models/Folder');
const Bookmark = require('../models/Bookmark');

// search request
const sendWebSearchRequest = async (req, res) => {
    let { query, folderId } = req.body;
    console.log('searching for: "', query, '" in folder:', folderId);
    let bookmarksUrls = [];
    await getAllLinks(res, bookmarksUrls, folderId);
    console.log('found bookmarks urls:', bookmarksUrls);
    if (bookmarksUrls.length > 0) {
        let firstDomain = new URL(bookmarksUrls[0]);
        firstDomain = firstDomain.origin;
        query = query.concat(' site:', firstDomain);
        for (const bookmarkUrl of bookmarksUrls.slice(1)) {
            let domain = new URL(bookmarkUrl);
            domain = domain.origin;
            query = query.concat(' OR site:', domain);
        }
    }
    console.log('query:', query);
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const searchEngineId = process.env.SEARCH_ENGINE_ID;
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${query}`;
    try {
        const response = await axios.get(url);
        const responseResults = response.data;
        if ('items' in responseResults) {
            const searchResults = responseResults.items
            console.log(searchResults);
            res.status(200).json(searchResults);
        }
        else {
            res.status(404).json({error: "No items found."});
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllLinks = async (res, bookmarksUrls, folderId) => {
    try {
        // get links from current folder
        const currentFolder = await Folder.findById(folderId);
        const bookmarks = await Bookmark.find({ folder: currentFolder.name });
        if (bookmarks.length > 0) {
            for (const bookmark of bookmarks) {
                bookmarksUrls.push(bookmark.url);
            }
        }
        // get links from subfolders
        const subfolders = await Folder.find({ parentFolder: currentFolder.name });
        for (const subfolder of subfolders) {
            await getAllLinks(res, bookmarksUrls, subfolder._id);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    sendWebSearchRequest
}