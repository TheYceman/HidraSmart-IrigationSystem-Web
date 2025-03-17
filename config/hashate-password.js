function hashatePassword(password){
    const crypto = require('crypto');
    return crypto.createHash('sha3-512').update(password).digest("hex");
};

module.exports = { hashatePassword };