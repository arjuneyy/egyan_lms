const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_FACTOR = 10;

const validateEmail = (email) => {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'Fullname is required.'],
    },
    type: {
        type: Number,
        required: [true, 'User type is required.']
    },
    emailId: {
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

userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(SALT_FACTOR);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (err) {
        return next(err);
    }
});

userSchema.methods.validatePassword = async function validationPassword(data) {
    return await bcrypt.compare(data, this.password);
};


module.exports.UserModel = mongoose.model('User', userSchema);
