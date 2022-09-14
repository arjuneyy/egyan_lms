// @ts-nocheck
var UserModel = require('../models/user').UserModel;
var passwordService = require('../services/passwordService');


async function create(fullname, type, email, password) {
    const user = new UserModel({
        fullname: fullname,
        type: type,
        email: email,
        password: await passwordService.hash(password)
    });

    try {
        return await user.save();
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

async function login(email, password) {
    let loginResult = true;
    const user = await UserModel.findOne({ email: email });

    if (user) {
        loginResult = await passwordService.verify(password, user.password);
    }

    if (!user || !loginResult) throw 'Invalid email and/or password.';

    return user;
}

async function update(id, fullname, type, email, password) {
    try {
        let foundUsers = await findById(id);
        if (!foundUsers) throw `User with id '${id}' not found.`;

        const userData = {
            fullname: fullname,
            type: type,
            email: email,
            password: password
        };
        const validateUserData = new UserModel(userData);
        let errors = validateUserData.validateSync();
        if (errors) throw errors;

        return await UserModel.findByIdAndUpdate({ '_id': id }, userData, { new: true });
    } catch (err) {
        if (err.name === 'ValidationError') {
            error = Object.values(err.errors).map(val => val.message);
            throw error;
        } else if (err.name === 'MongoServerError' && err.code === 11000) {
            throw 'Email must be unique.';
        } else {
            throw err;
        }
    }
}

async function deleteUser(id) {
    try {
        let foundUsers = await findById(id);
        if (!foundUsers) throw `User with id '${id}' not found.`;

        await UserModel.deleteOne({ _id: id });
        return `User with id '${id}' successfully deleted.`;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    create,
    findAll,
    findById,
    login,
    update,
    deleteUser
}
