const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const folderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    parentFolder: {
        type: String,
        required: true
    },
    linksNumber: {
        type: Number,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Folder', folderSchema);