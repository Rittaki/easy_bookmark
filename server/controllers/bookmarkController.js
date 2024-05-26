const Bookmark = require('../models/Bookmark');
const mongoose = require('mongoose');
const escapeRegExp = require('lodash.escaperegexp');

// get all bookmarks
const getBookmarks = async (req, res) => {
    const reqQuery = req.query;
    console.log(reqQuery);

    const bookmarks = await Bookmark.find(reqQuery).sort({ createdAt: -1 }); // add conditions inside brackets, for example: { folder: 'Education'} returns all bookmarks that are in Education folder

    res.status(200).json(bookmarks);
};

// get a single bookmark
const getBookmark = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Bookmark not found' });
    };

    const bookmark = await Bookmark.findById(id);
    if (!bookmark) {
        return res.status(404).json({ error: 'Bookmark not found' });
    }

    res.status(200).json(bookmark);
};

// create new bookmark
const createBookmark = async (req, res) => {
    const { title, url, folder } = req.body;

    // add doc to db
    try {
        const bookmark = await Bookmark.create({ title, url, folder });
        res.status(200).json(bookmark);
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
};

// delete a bookmark
const deleteBookmark = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Bookmark not found' });
    };

    const bookmark = await Bookmark.findOneAndDelete({ _id: id });
    if (!bookmark) {
        return res.status(404).json({ error: 'Bookmark not found' });
    }

    res.status(200).json(bookmark);
};

// update a bookmark
const updateBookmark = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Bookmark not found' });
    };

    const bookmark = await Bookmark.findOneAndUpdate({ _id: id }, {
        ...req.body
    });
    if (!bookmark) {
        return res.status(404).json({ error: 'Bookmark not found' });
    }

    res.status(200).json(bookmark);
};

// search bookmarks
const searchBookmarks = async (req, res) => {
    console.log("inside search function");
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const searchTerm = escapeRegExp(req.query.searchTerm) || '';

    const bookmarks = await Bookmark.find({
        $or: [
            {
                title: { $regex: searchTerm, $options: 'i' }
            },
            {
                url: { $regex: searchTerm, $options: 'i' }
            }
        ]
    }).limit(limit).skip(startIndex);
    console.log(bookmarks);
    if (!bookmarks) {
        return res.status(404).json({ error: 'Search bookmarks error' });
    }

    res.status(200).json(bookmarks);
};

module.exports = {
    getBookmark,
    getBookmarks,
    createBookmark,
    deleteBookmark,
    updateBookmark,
    searchBookmarks
}