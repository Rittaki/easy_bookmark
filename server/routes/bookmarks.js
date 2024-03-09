const express = require('express');
const router = express.Router();

// GET all bookmarks
router.get('/', (req, res) => {
    res.json({ mssg: 'GET all bookmarks' });
});

// GET a single bookmark
router.get('/:id', (req, res) => {
    res.json({ mssg: 'GET a single bookmark' });
});

// POST a new bookmark
router.post('/', (req, res) => {
    res.json({ mssg: 'POST a new bookmark' });
});

// DELETE a bookmark
router.delete('/:id', (req, res) => {
    res.json({ mssg: 'DELETE a bookmark' });
});

// UPDATE a bookmark
router.patch('/:id', (req, res) => {
    res.json({ mssg: 'UPDATE a bookmark' });
});

module.exports = router;