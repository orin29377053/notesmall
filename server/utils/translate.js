require("dotenv").config();
const { translateToList } = require("../constant/translateToList");
const { stopWords } = require("../constant/stopWords");
const text = "Hello, world!";
const { Translate } = require("@google-cloud/translate").v2;
const credentials = JSON.parse(process.env.GOOGLE_API_JSON);

const translate = new Translate({
    credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
    },
});

const dropStopWords = (str) => {
    const words = str.split(" ");

    const newArray = [];
    for (const word of words) {
        if (!stopWords.includes(word)) {
            newArray.push(word);
        }
    }



    return newArray.join(" ");
};

async function translateText(text, target) {
    let [translations] = await translate.translate(text, target);
    translations = Array.isArray(translations) ? translations : [translations];
    return translations;
}

async function detectLanguage(text) {
    let [detections] = await translate.detect(text);
    detections = Array.isArray(detections) ? detections : [detections];
    return detections;
}

async function translateKeyword(text) {
    try {
        const searchInputArray = text.split(" ");

        const detectResult = await detectLanguage(searchInputArray);
        detectResult.map((item) => {
            item.translateTo =
                item.confidence > 0.8 ? translateToList[item.language] : "en";
        });
        const translateList = Object.values(
            detectResult.reduce((acc, curr) => {
                if (!acc[curr.translateTo]) {
                    acc[curr.translateTo] = {
                        input: [],
                        translateTo: curr.translateTo,
                    };
                }
                acc[curr.translateTo].input.push(curr.input);
                return acc;
            }, {})
        );
        const translatResult = await Promise.all(
            translateList.map(async ({ input, translateTo }) => {
                const translated = await translateText(input, translateTo);


                const filtered = translated.map((item) => dropStopWords(item));

                return { input: input, output: filtered };
            })
        );
        const flattenedTranslatResult = [
            ...new Set(
                translatResult.flatMap((item) => [
                    ...item.input,
                    ...item.output,
                ])
            ),
        ];

        return flattenedTranslatResult.join(" ");
    } catch {
        return text;
    }
}

module.exports = {
    translateText,
    detectLanguage,
    translateKeyword,
};

// translateText(text);
