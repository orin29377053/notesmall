require('dotenv').config();

const Keyv = require("keyv");
const cache = new Keyv(process.env.REDIS);
cache.set("foo", "bar");
exports.cache=cache