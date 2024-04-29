const express = require('express');
const { 
    generateFolder,
    generateTitle,
    suggestFolder
 } = require('../controllers/chatgptController');

const router = express.Router();

// POST a generate folder name request
router.post('/generate_folder', generateFolder);

// POST a generate url title request
router.post('/generate_title', generateTitle);

// POST a suggest existing folder request
router.post('/suggest_folder', suggestFolder);

module.exports = router;