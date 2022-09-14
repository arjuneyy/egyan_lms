const bcrypt = require('bcrypt');


async function hash(password) {
    return await bcrypt.hash(password, 10);
}

async function verify(password, hash) {
    return await bcrypt.compare(password, hash);
}


module.exports = { hash, verify }
