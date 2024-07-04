const User = require('../models/User');

// register user
const createUser = async (req, res) => {
    const { name, email, uid } = req.body;
    console.log( name, email, uid );

    try {
        console.log('creating user...');
        const user = await User.signup(name, email, uid);
        res.status(200).json({ email, user, message: "User created successfully!" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
};

module.exports = {
    createUser
}