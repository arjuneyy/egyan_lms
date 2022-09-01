var UserModel = require('../models/user').UserModel;


async function create(fullname, type, email, password) {
    const user = new UserModel({
        fullname: fullname,
        type: type,
        email: email,
        password: password
    });

    try {
        const savedUser = await user.save();
        return 'User has been successfully registered.'
    } catch (err) {
        if (err.name === 'ValidationError') {
            error = Object.values(err.errors).map(val => val.message);
            throw error;
        } else if (err.name === 'MongoServerError' && err.code === 11000) {
            throw 'Email must be unique.';
        }
    }
}

async function findAll() {
    return await UserModel.find();
}

async function findById(id) {
    return await UserModel.findById(id);
}

module.exports = {
    create,
    findAll,
    findById
}
