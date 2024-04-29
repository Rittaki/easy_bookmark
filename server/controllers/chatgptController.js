const Folder = require('../models/Folder');
const OpenAI = require('openai');
const mongoose = require('mongoose');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// generate new folder name
const generateFolder = async (req, res) => {
    console.log('inside generate folder');
    const { url } = req.body;
    console.log('url from request: ' + url);

    try {
        const prompt = `Look at this website: ${url}. Generate folder names where I can put this website as bookmark, give me top three names that you've generated. Each name contains one word. Return response in the following parsable JSON format: { "folder_names": [ "First", "Second", "Third" ] }`;

        const response = await openai.completions.create({
            model: "gpt-3.5-turbo-instruct",
            prompt: prompt,
            max_tokens: 2048,
            temperature: 0.7
        });

        console.log("response usage: " + JSON.stringify(response.usage));
        res.status(200).json(JSON.parse(response.choices[0].text));
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
};

// generate new bookmark title
const generateTitle = async (req, res) => {
    console.log('inside generate title');
    const { url } = req.body;
    console.log('url from request: ' + url);

    try {
        const prompt = `Look at this website: ${url}. I want to save it as a bookmark and I need you to generate title for this website, give me top three titles that you've generated. Be more precise and accurate, create short titles. Return response in the following parsable JSON format: { "titles": [ "First", "Second", "Third" ] }`;

        const response = await openai.completions.create({
            model: "gpt-3.5-turbo-instruct",
            prompt: prompt,
            max_tokens: 2048,
            temperature: 1
        });

        console.log("response usage: " + JSON.stringify(response.usage));
        res.status(200).json(JSON.parse(response.choices[0].text));
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
};

// suggest relevnt folder
const suggestFolder = async (req, res) => {
    console.log('inside suggest folder');
    const { url } = req.body;
    console.log('url from request: ' + url);

    // add db request for getting all folders in Folder controller and use it (later save all the folders in useContext in front)
    const folders = await Folder.find().sort({ createdAt: -1 });
    let foldersArray = [];
    
    folders.forEach(folder => {
        // console.log(folder.name);
        foldersArray.push(folder.name);
    });

    console.log('folders: ' + foldersArray.join(', '));
 
    try {
        const prompt = `Look at this website: ${url}. I have folowing folders: ${foldersArray.join(', ')}. Choose up to 2 folders where I can put this website as a bookmark. Don't suggest me new folders. Return response in the following parsable JSON format: { "folder_names": [ "First", "Second", "Third" ] }`;

        const response = await openai.completions.create({
            model: "gpt-3.5-turbo-instruct",
            prompt: prompt,
            max_tokens: 2048,
            temperature: 0
        });

        console.log("response usage: " + JSON.stringify(response.usage));
        // check that all folders that are in the response exist. If not, maybe choose and create a folder with such a name. (in gpt4 it doesn't suggest what is not exist)
        res.status(200).json(JSON.parse(response.choices[0].text));
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
};

module.exports = {
    generateFolder,
    generateTitle,
    suggestFolder
}