const { getPresignedUrl } = require("../utils/bucket");
const getImagePresignedUrl = async (req, res) => {
    const fileName = req.query.fileName;

    const { url, objectUrl } = await getPresignedUrl(fileName);
    res.json({
        presignedUrl: url,
        objectUrl: objectUrl,
    });
};

module.exports = {
    getImagePresignedUrl,
};
