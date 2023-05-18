require("dotenv").config();

const {
    S3Client,
    DeleteObjectCommand,
    PutObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
});

const deleteImage = async (url) => {
    const fileName = url.split("/").pop();
    console.log(fileName)

    try {
        const data = await s3.send(
            new DeleteObjectCommand({
                Bucket: process.env.AWS_BUCKET_RESIZE_NAME,
                Key: fileName,
            })
        );
        console.log("Success. Object deleted.", data);
        return data; 
    } catch (err) {
        console.log("Error", err);
    }
};

const getPresignedUrl = async (fileName) => {
    const input = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
    };
    const command = new PutObjectCommand(input);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    const objectUrl = `https://${process.env.AWS_IMAGE_RESIZE_CDN}/resized-${input.Key}`;

    return { url, objectUrl };
};

module.exports = {
    s3,
    deleteImage,
    getPresignedUrl,
};
