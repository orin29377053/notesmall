// cloud vision
require("dotenv").config();

const vision = require("@google-cloud/vision");
const credentials = JSON.parse(process.env.GOOGLE_API_JSON);
const ImageAnnotatorClient = new vision.ImageAnnotatorClient({
    credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
    },
});
async function imageDetection(client, url) {
    console.log("i am start to call cloud vision api")
    const [result] = await client.labelDetection({
        image: {
            source: {
                imageUri: url,
            },
        },
    });
    // console.log(result.labelAnnotations);
    const autoTags = result.labelAnnotations.map((item) => item.description);
    console.log(autoTags);
    return autoTags;
}

module.exports = {
    imageDetection,
    ImageAnnotatorClient,
};
