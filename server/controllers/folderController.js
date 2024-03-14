const Folder = require('../models/Folder');
const mongoose = require('mongoose');

// get all folders
const getFolders = async (req, res) => {
    const reqQuery = req.query;
    console.log(reqQuery);

    const folders = await Folder.find(reqQuery).sort({createdAt: -1}); // add conditions inside brackets, for example: { parentFolder: 'Education'} returns all folders that are in Education folder

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
        return res.status(404).json({error: 'Folder not found'});
    };

    const folder = await Folder.findById(id);
    if (!folder) {
        return res.status(404).json({error: 'Folder not found'});
    }

    res.status(200).json(folder);
};

// create new folder
const createFolder = async (req, res) => {
    const { name, parentFolder, linksNumber } = req.body;

    // add doc to db
    try {
        const folder = await Folder.create({name, parentFolder, linksNumber});
        res.status(200).json(folder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
};

// delete a folder
const deleteFolder = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Folder not found'});
    };

    const folder = await Folder.findOneAndDelete({_id: id});
    if (!folder) {
        return res.status(404).json({error: 'Folder not found'});
    }

    res.status(200).json(folder);
};

// update a folder
const updateFolder = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Folder not found'});
    };

    const folder = await Folder.findOneAndUpdate({_id: id}, {
        ...req.body
    });
    if (!folder) {
        return res.status(404).json({error: 'Folder not found'});
    }

    res.status(200).json(folder);
};

module.exports = {
    getFolder,
    getFolders,
    // getFoldersByQuery,
    createFolder,
    deleteFolder,
    updateFolder
}