const { getPresignedUrl } = require("../utils/bucket");
const { tokenVerify } = require("../utils/tokenVerify");
const logger = require("../utils/logger");
require("dotenv").config();

const getImagePresignedUrl = async (req, res) => {
    //jwt verify
    const jwt = req.headers.token;
    if (!jwt) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
    try {
        const user = await tokenVerify(jwt, process.env.SECRET);
        const fileName = req.query.fileName;

        const { url, objectUrl } = await getPresignedUrl(fileName);

        logger.info(
            "Image Upload",
            `User ${user.id} get presigned url for ${fileName}`
        );

        res.json({
            presignedUrl: url,
            objectUrl: objectUrl,
        });
    } catch (e) {
        logger.error("Auth Error", e, "Someone try to get presigned url");
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
};

module.exports = {
    getImagePresignedUrl,
};
