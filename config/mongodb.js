const mongoClient = require('mongodb').MongoClient;

const state = {
    db: null
};

// Credentials
const username = 'egyan';
const password = 'egyan123';
const dbName = 'egyandb';
const url = `mongodb://egyan:egyan123@192.168.55.124:27017/egyandb/?authSource=admin`;

function connect() {
    mongoClient.connect(url, (err, data) => {
        if (err) {
            throw new Error(err);
        }

        console.log('Database successfully connected.');
        state.db = data.db(dbName);
    });
}


module.exports.connect = connect;
module.exports.get = () => state.db;