const mongoose = require('mongoose');

const validateEmail = (email) => {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'Fullname is required.'],
    },
    type: {
        type: String,
        required: [true, 'User type is required.'],
        enum: {
            values: ['Instructor', 'Student'],
            message: 'Type should either be a Student or Instructor.'
        }
    },
    email: {
        type: String,
        required: [true, 'Email address is required.'],
        unique: true,
        validate: [validateEmail, 'Invalid email address.']
    },
    password: {
        type: String,
        required: [true, 'Password is required.']
    }
})


module.exports.UserModel = mongoose.model('User', userSchema);
