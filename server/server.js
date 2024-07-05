require('dotenv').config();

const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
const bookmarksRoutes = require('./routes/bookmarks');
const foldersRoutes = require('./routes/folders');
const chatgptRoutes = require('./routes/chatgpt');
const usersRoutes = require('./routes/users');
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

// // The main search function
// var google_web_search = function(search, callback) {
//     console.log('Searching the web for: ', search);
//     var options = {
//         method: 'GET',
//         url: 'https://www.googleapis.com/customsearch/v1',
//         qs: {
//             q: search,
//             key: process.env.GOOGLE_SEARCH_API_KEY,
//             cx: process.env.SEARCH_ENGINE_ID,
//         }
//     };

//     axios(options, function (error, response, body) {
//         callback(error, body);
//     });
// };
// app.get('/api/web_search', function (req, res) {
//     google_web_search('recipe', function(error, body) {
//       if (!error) {
//          res.send(body);
//       } else {
//          throw new Error(error);
//       }
//     });
//  });

async function search(query) {
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const searchEngineId = process.env.SEARCH_ENGINE_ID;
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${query}`;

    try {
        const response = await axios.get(url);
        const searchResults = response.data.items;
        // Process the search results as needed
        console.log(searchResults);
    } catch (error) {
        console.error('Error fetching search results:', error.message);
    }
}

// Example usage
// search('Creme pattissiere site:https://theloopywhisk.com/');