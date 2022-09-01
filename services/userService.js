var UserModel = require('../models/user').UserModel;


function create(fullname, type, email, password) {
    return new Promise((resolve, reject) => {
        const user = new UserModel({
            fullname: fullname,
            type: type,
            email: email,
            password: password
        });

        user.save()
            .then(() => {
                resolve('User has been successfully registered.');
            })
            .catch(err => {
                if (err.name === 'ValidationError') {
                    error = Object.values(err.errors).map(val => val.message);
                    reject(error)
                } else if (err.name === 'MongoServerError' && err.code === 11000) {
                    reject('Email must be unique.');
                }

                reject(err);
            });
    });
}

function findAll() {
    return new Promise((resolve, reject) => {
        UserModel.find().exec((err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

function findById(id) {
    return new Promise((resolve, reject) => {
        UserModel.findById(id).exec((err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    });
}

module.exports = {
    create,
    findAll,
    findById
}
