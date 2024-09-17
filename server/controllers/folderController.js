const Folder = require('../models/Folder');
const Bookmark = require('../models/Bookmark');
const mongoose = require('mongoose');

// get all folders
const getFolders = async (req, res) => {
    const reqQuery = req.query;
    console.log("reqQuery for folders is: ", reqQuery);

    const folders = await Folder.find(reqQuery).sort({ createdAt: -1 }); // add conditions inside brackets, for example: { parentFolder: 'Education'} returns all folders that are in Education folder

    res.status(200).json(folders);
};

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
    const { name, parentFolder, linksNumber, path, userId } = req.body;

    // add doc to db
    try {
        const folder = await Folder.create({ name, parentFolder, linksNumber, path, userId });
        res.status(200).json(folder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
};

const deleteFolderAndDescendants = async (res, folderId) => {
    try {
        console.log('inside deleteFolderAndDescendants');
        if (!mongoose.Types.ObjectId.isValid(folderId)) {
            return res.status(404).json({ error: 'ID not found' });
        };

        const folder = await Folder.findById(folderId);
        if (!folder) {
            return res.status(404).json({ error: 'Folder not found' });
        }

        // delete bookmarks inside
        const bookmarks = await Bookmark.find({ folder: folder.name });
        console.log("bookmarks found:", bookmarks);
        const bookmarksDeleteRes = await Bookmark.deleteMany({ folder: folder.name });
        if (!bookmarksDeleteRes) {
            console.log(bookmarksDeleteRes);
            return res.status(404).json({ error: bookmarksDeleteRes });
        }
        else {
            console.log("Deleted Bookmarks:", bookmarksDeleteRes);
        }

        // delete folders (recurcively)
        const folders = await Folder.find({ parentFolder: folder.name });
        console.log("folders found:", folders);
        for (const childFolder of folders) {
            await deleteFolderAndDescendants(res, childFolder._id);
        }
        const folderDeleteRes = await Folder.findByIdAndDelete(folder._id);
        if (!folderDeleteRes) {
            console.log(folderDeleteRes);
            return res.status(404).json({ error: `Can't delete a folder ${folder.name}` });
        }
        else {
            console.log("Deleted folder:", folderDeleteRes);
        }
        return folder;
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}
// delete a folder
const deleteFolder = async (req, res) => {
    const { id } = req.params;
    const folder = await deleteFolderAndDescendants(res, id);
    console.log('deleteFolder called');
    console.log('folder returnes is:', folder);
    res.status(200).json(folder);
};

const updateFolderAndDescendants = async (res, folderId) => {
    try {
        console.log('inside updateFolderAndDescendants');
        if (!mongoose.Types.ObjectId.isValid(folderId)) {
            return res.status(404).json({ error: 'ID not found' });
        };

        const folder = await Folder.findById(folderId);
        if (!folder) {
            return res.status(404).json({ error: 'Folder not found' });
        }

        // update bookmarks inside
        const bookmarks = await Bookmark.find({ folder: folder.name });
        console.log("bookmarks found:", bookmarks);
        const bookmarksUpdateRes = await Bookmark.updateMany({ folder: folder.name }, { path: folder.path + "/" + folder.name });
        if (!bookmarksUpdateRes) {
            console.log(bookmarksUpdateRes);
            return res.status(404).json({ error: bookmarksUpdateRes });
        }
        else {
            console.log("Updated Bookmarks:", bookmarksUpdateRes);
        }

        // update folders (recurcively)
        const folders = await Folder.find({ parentFolder: folder.name });
        console.log("folders found:", folders);
        const folderUpdateRes = await Folder.updateMany({ parentFolder: folder.name }, { path: folder.path + "/" + folder.name });
        if (!folderUpdateRes) {
            console.log(folderUpdateRes);
            return res.status(404).json({ error: `Can't Update a folder ${folder.name}` });
        }
        else {
            console.log("Updated folder:", folderUpdateRes);
        }
        for (const childFolder of folders) {
            await updateFolderAndDescendants(res, childFolder._id);
        }
        return folder;
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
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

    if (req.body.parentFolder) {
        // ADD CHECK THAT NEW PARENT FOLDER IS NOT A DESCEDENT OF CURRENT FOLDER (TO AVOID INFINITE LOOP)
        await updateFolderAndDescendants(res, oldFolder._id);
    }
    else {
        // bookmarks update part
        const bookmarks = await Bookmark.find({ folder: oldFolder.name });
        console.log(bookmarks);
        const bookmarksUpdateRes = await Bookmark.updateMany({ folder: oldFolder.name }, { folder: folderName, path: oldFolder.path + "/" + folderName });
        if (!bookmarksUpdateRes) {
            console.log(bookmarksUpdateRes);
            return res.status(404).json({ error: bookmarksUpdateRes });
        }
        else {
            console.log("Updated Bookmarks:", bookmarksUpdateRes);
        }
        // children folders update part
        const childrenFolders = await Folder.find({ parentFolder: oldFolder.name });
        console.log(childrenFolders);
        const foldersUpdateRes = await Folder.updateMany({ parentFolder: oldFolder.name }, { parentFolder: folderName, path: oldFolder.path + "/" + folderName });

        if (!foldersUpdateRes) {
            console.log(foldersUpdateRes);
            return res.status(404).json({ error: foldersUpdateRes });
        }
        else {
            console.log("Updated Folders:", bookmarksUpdateRes);
        }
        for (const childFolder of childrenFolders) {
            await updateFolderAndDescendants(res, childFolder._id);
        }
    }
    res.status(200).json(oldFolder);
};

module.exports = {
    getFolder,
    getFolders,
    createFolder,
    deleteFolder,
    updateFolder
}