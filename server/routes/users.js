const express = require('express');
const { 
    createUser
 } = require('../controllers/userController');

const router = express.Router();

// REGISTER a user
router.post('/register', createUser);

module.exports = router;