const jwt = require("jsonwebtoken");

function tokenVerify(token, secret) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, function (err, decoded) {
            if (err) {
                reject(err);
            } else if (decoded) {
                resolve(decoded);
            }
        });
    });
}
module.exports = {
    tokenVerify,
};
