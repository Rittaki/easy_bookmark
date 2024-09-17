const express = require('express');
const { 
    getFolder,
    getFolders,
    createFolder,
    deleteFolder,
    updateFolder
 } = require('../controllers/folderController');

const router = express.Router();

// GET all folders
router.get('/', getFolders);

// GET a single folder
router.get('/:id', getFolder);

// POST a new folder
router.post('/', createFolder);

// DELETE a folder
router.delete('/:id', deleteFolder);

// UPDATE a folder
router.patch('/:id', updateFolder);

module.exports = router;