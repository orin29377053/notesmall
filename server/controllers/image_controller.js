require('dotenv').config();
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3 } = require("../utils/bucket");
const {
    PutObjectCommand,
} = require("@aws-sdk/client-s3");
const getImagePresignedUrl = async (req, res) => {
    const fileName = req.query.fileName;
    const input = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
    };
    const command = new PutObjectCommand(input);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    res.json({
        presignedUrl: url,
        objectUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${input.Key}`,
    });
};

module.exports = {
    getImagePresignedUrl,
};
