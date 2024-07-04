const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    uid: {
        type: String,
        required: true
    }
});

// static signup method
userSchema.statics.signup = async function (name, email, uid) {
    const exists = await this.findOne({ email });
    if (exists) {
        throw Error('Email already in use');
    }
    const user = await this.create({ name: name, email: email, uid: uid });
    return user;
}
module.exports = mongoose.model('User', userSchema);