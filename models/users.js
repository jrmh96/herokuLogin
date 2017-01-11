var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
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
// authenticate input against database documents
UserSchema.statics.authenticate = function(email, password, callback) {
    User.findOne({ email: email})
        .exec(function (error, user){
            if(error){
                callback(error);
            }
            else if( !user){
                var err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            bcrypt.compare(password, user.password, function(error, result){  //result is of type boolean
                if(result === true){
                    return callback(null, user);
                } else {
                    return callback();
                }
            });
        });
}

// hash password before saving to database

UserSchema.pre('save', function(next){
    var user = this;
    bcrypt.hash(user.password, 10, function(err, hash){
        if(err){
            return next(err);
        }
        user.password = hash;
        next();
    });
});

var User = mongoose.model('User', UserSchema);
module.exports = User;