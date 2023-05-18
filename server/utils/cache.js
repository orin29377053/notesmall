require("dotenv").config();

const Keyv = require("keyv");

class Cache {
    constructor() {
        if (!Cache.instance) {
            this.cache = new Keyv(process.env.REDIS);
            Cache.instance = this;
        }

        return Cache.instance;
    }

    async set(key, value) {
        try {
            await this.cache.set(key, value);
        } catch (error) {
            console.error("Error setting key to cache:", error);
        }
    }

    async get(key) {
        try {
            return await this.cache.get(key);
        } catch (error) {
            console.error("Error getting key from cache:", error);
        }
    }
}

const cache = new Cache();

module.exports = cache;
