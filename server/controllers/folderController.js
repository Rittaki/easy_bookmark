const Folder = require('../models/Folder');
const Bookmark = require('../models/Bookmark');
const mongoose = require('mongoose');

// get all folders
const getFolders = async (req, res) => {
    const reqQuery = req.query;
    console.log(reqQuery);

    const folders = await Folder.find(reqQuery).sort({ createdAt: -1 }); // add conditions inside brackets, for example: { parentFolder: 'Education'} returns all folders that are in Education folder

    res.status(200).json(folders);
};

// // get folders by query
// const getFoldersByQuery = async (req, res) => {
//     const reqQuery = req.query;
//     console.log(reqQuery);
//     const folders = await Folder.find(reqQuery);

//     res.status(200).json(folders);
// };

// get a single folder
const getFolder = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Folder not found' });
    };

    const folder = await Folder.findById(id);
    if (!folder) {
        return res.status(404).json({ error: 'Folder not found' });
    }

    res.status(200).json(folder);
};

// create new folder
const createFolder = async (req, res) => {
    const { name, parentFolder, linksNumber } = req.body;

    // add doc to db
    try {
        const folder = await Folder.create({ name, parentFolder, linksNumber });
        res.status(200).json(folder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
};

// delete a folder
const deleteFolder = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Folder not found' });
    };

    const folder = await Folder.findOneAndDelete({ _id: id });
    if (!folder) {
        return res.status(404).json({ error: 'Folder not found' });
    }

    res.status(200).json(folder);
};

// update a folder
const updateFolder = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Folder not found' });
    };
    const folderName = req.body.name;
    console.log("Folder name from controller:", folderName);
    const oldFolder = await Folder.findOneAndUpdate({ _id: id }, {
        ...req.body
    });
    if (!oldFolder) {
        return res.status(404).json({ error: 'Folder not found' });
    }
    console.log("Old folder name from controller:", oldFolder.name);
    // bookmarks update part
    const bookmarks = await Bookmark.find({folder: oldFolder.name});
    console.log(bookmarks);
    const bookmarksUpdateRes = await Bookmark.updateMany({ folder: oldFolder.name }, { folder: folderName });
    if (!bookmarksUpdateRes) {
        console.log(bookmarksUpdateRes);
        return res.status(404).json({error: bookmarksUpdateRes});
    }
    else {
        console.log("Updated Bookmarks:", bookmarksUpdateRes);
    }
    // children folders update part
    const childrenFolders = await Folder.find({ parentFolder: oldFolder.name });
    console.log(childrenFolders);
    const foldersUpdateRes = await Folder.updateMany({ parentFolder: oldFolder.name }, { parentFolder: folderName });

    if (!foldersUpdateRes) {
        console.log(foldersUpdateRes);
        return res.status(404).json({error: foldersUpdateRes});
    }
    else {
        console.log("Updated Folders:", bookmarksUpdateRes);
    }
    res.status(200).json(oldFolder);
};

module.exports = {
    getFolder,
    getFolders,
    // getFoldersByQuery,
    createFolder,
    deleteFolder,
    updateFolder
}