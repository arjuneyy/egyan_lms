const mongoose = require('mongoose');

// Credentials
const username = 'egyan';
const password = 'egyan123';
const dbName = 'egyandb';
const url = `mongodb://${username}:${password}@localhost:27017/${dbName}?authSource=admin`;

function connect() {
    mongoose.connect(url, { useNewUrlParser: true })
        .then(() => console.log('MongoDB Connected ...'))
        .catch(err => console.log(err));
}

module.exports.connect = connect;