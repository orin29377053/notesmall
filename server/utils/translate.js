require("dotenv").config();
const { translateToList } = require("../constant/translateToList");
const { stopWords } = require("../constant/stopWords");
const { Translate } = require("@google-cloud/translate").v2;
const credentials = JSON.parse(process.env.GOOGLE_API_JSON);

const translator = new Translate({
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
    let [translations] = await translator.translate(text, target);
    translations = Array.isArray(translations) ? translations : [translations];
    return translations;
}

async function detectLanguage(text) {
    let [detections] = await translator.detect(text);
    detections = Array.isArray(detections) ? detections : [detections];
    return detections;
}

async function translateKeyword(text) {
    try {
        // abc de 你 好=>[abc,de,你,好]
        const searchInputArray = text.split(" ");

        const detectResult = await detectLanguage(searchInputArray);

        detectResult.forEach((item) => {
            item.translateTo =
                item.confidence > 0.8 ? translateToList[item.language] : "en";
        });

        // [{input:[abc,de],translateTo:zh},{input:[你,好],translateTo:en}]

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

        // translate the input to the target language

        const translateResult = await Promise.all(
            translateList.map(async ({ input, translateTo }) => {
                const translated = await translateText(input, translateTo);

                const filtered = translated.map((item) => dropStopWords(item));

                return { input, output: filtered };
            })
        );

        // drop the duplicate words and then join them together to array
        const flattenedTranslateResult = [
            ...new Set(
                translateResult.flatMap((item) => [
                    ...item.input,
                    ...item.output,
                ])
            ),
        ];

        // [abc,de,你,好]=>abc de 你 好

        return flattenedTranslateResult.join(" ");
    } catch {
        return text;
    }
}

module.exports = {
    translateKeyword,
    dropStopWords,
    translateText,
    detectLanguage,
};
