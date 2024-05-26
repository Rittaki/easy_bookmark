const express = require('express');
const { 
    getBookmark,
    getBookmarks,
    createBookmark,
    deleteBookmark,
    updateBookmark,
    searchBookmarks
 } = require('../controllers/bookmarkController');

const router = express.Router();

// SEARCH a bookmark
router.get('/search', searchBookmarks);

// GET all bookmarks
router.get('/', getBookmarks);

// GET a single bookmark
router.get('/:id', getBookmark);

// POST a new bookmark
router.post('/', createBookmark);

// DELETE a bookmark
router.delete('/:id', deleteBookmark);

// UPDATE a bookmark
router.patch('/:id', updateBookmark);

// // SEARCH a bookmark
// router.get('/search', searchBookmarks);

module.exports = router;