require('dotenv').config();

const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
const bookmarksRoutes = require('./routes/bookmarks');
const foldersRoutes = require('./routes/folders');
const chatgptRoutes = require('./routes/chatgpt');
const usersRoutes = require('./routes/users');
const webSearchRoutes = require('./routes/webSearch');
// additional imports for search
const axios = require('axios');

// express app
const app = express();

// middleware
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// routes
app.use('/api/bookmarks', bookmarksRoutes);
app.use('/api/folders', foldersRoutes);
app.use('/api/chatgpt', chatgptRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/web_search', webSearchRoutes);

// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT, () => {
            console.log('connected to db & listening on port', process.env.PORT);
        });
    })
    .catch((err) => {
        console.log(err);
    });
