var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true, //make sure email address does not already exist in the database
        required: true, //email is required for each User
        trim: true // trim whitespace before and after string
    },
    
    name: {
        type: String,
        required: true,
        trim: true
    },

    favoriteBook: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
});

var User = mongoose.model('User', UserSchema);
module.exports = User;