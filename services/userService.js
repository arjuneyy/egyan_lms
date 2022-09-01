const db = require('../config/mongodb');
const collection = require('../config/collection');

function UserService() {

    this.getUsers = function (callback) {
        const userCollection = db.get().collection(collection.USER_COLLECTIONS);
        userCollection.find({ name: 'Arjun' }).toArray((err, items) => {
            if (err) {
                throw new Error(err);
            }

            callback(items);
        });
    }
}

module.exports.UserService = new UserService();