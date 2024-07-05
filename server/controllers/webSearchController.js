const Folder = require('../models/Folder');
const Bookmark = require('../models/Bookmark');

// register user
const sendWebSearchRequest = async (req, res) => {
    const { query } = req.body;
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const searchEngineId = process.env.SEARCH_ENGINE_ID;
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${query}`;
    // const { name, email, uid } = req.body;
    // console.log( name, email, uid );

    // try {
    //     console.log('sending request...');
    //     const user = await User.signup(name, email, uid);
    //     res.status(200).json({ email, user, message: "User created successfully!" });
    // } catch (error) {
    //     res.status(400).json({ error: error.message });
    // };
};

module.exports = {
    sendWebSearchRequest
}