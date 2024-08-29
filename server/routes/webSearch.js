const express = require('express');
const { 
    sendWebSearchRequest
 } = require('../controllers/webSearchController');

const router = express.Router();

// handle web search requests
router.post('/', sendWebSearchRequest);

module.exports = router;