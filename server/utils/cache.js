const Keyv = require("keyv");
const cache=new Keyv("redis://default@127.0.0.1:6379")
exports.cache=cache