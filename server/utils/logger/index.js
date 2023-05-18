const { eventLogFormatter, errorLogFormatter } = require("./logFormatter");

class Logging {
    constructor() {}

    info(eventName, logMessage) {
        console.info(eventLogFormatter(eventName, logMessage));
    }
    error(ErrorName, rawError, logMessage) {
        console.error(errorLogFormatter(ErrorName, rawError, logMessage));
    }
}

const logger = new Logging();

module.exports = logger;
