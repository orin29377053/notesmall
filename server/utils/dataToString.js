module.exports = function dataToString(data) {
    return new Date(data).toISOString();
};
