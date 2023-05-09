// cloud vision
require("dotenv").config();

const vision = require("@google-cloud/vision");

async function imageDetection( url) {
    const credentials = JSON.parse(process.env.GOOGLE_API_JSON);
    const ImageAnnotatorClient = new vision.ImageAnnotatorClient({
        credentials: {
            client_email: credentials.client_email,
            private_key: credentials.private_key,
        },
    });
    const [result] = await ImageAnnotatorClient.labelDetection({
        image: {
            source: {
                imageUri: url,
            },
        },
    });
    const autoTags = result.labelAnnotations.map((item) => item.description);
    return autoTags;
}

module.exports = {
    imageDetection,
    
};
