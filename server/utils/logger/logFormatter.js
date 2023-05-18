function errorLogFormatter(ErrorName, rawError, logMessage) {
    return `Error - ${new Date().toISOString()} - ${ErrorName} - ${rawError} - ${logMessage}`;
}
function eventLogFormatter(EventName, logMessage) {
    return `Event - ${new Date().toISOString()} - ${EventName} - ${logMessage}`;
}
module.exports = {
    errorLogFormatter,
    eventLogFormatter
};
