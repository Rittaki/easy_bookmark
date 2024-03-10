const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookmarkSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    folder: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);