require("dotenv").config();

const { Translate } = require("@google-cloud/translate").v2;
const credentials = JSON.parse(process.env.GOOGLE_API_JSON);
const {
    translateKeyword,
    dropStopWords,
    translateText,
    detectLanguage,
} = require("../utils/translate.js");

describe("dropStopWords", () => {
    test("去除停用詞", () => {
        const str = "This is a test sentence.";
        const expected = "This test sentence.";
        const result = dropStopWords(str);
        expect(result).toEqual(expected);
    });

    test("不包含停用詞的情況", () => {
        const str = "No stop words here.";
        const expected = "No stop words here.";
        const result = dropStopWords(str);
        expect(result).toEqual(expected);
    });

    test("空字串輸入", () => {
        const str = "";
        const expected = "";
        const result = dropStopWords(str);
        expect(result).toEqual(expected);
    });
});

const mockTranslate = jest.fn((text, target) => {
    const translations = Array.isArray(text)
        ? text.map((t) => `Translated: ${t}`)
        : `Translated: ${text}`;
    return Promise.resolve(translations);
});

// 模擬 Translate 類別的建構函式
jest.mock("@google-cloud/translate", () => ({
    v2: {
        Translate: jest.fn().mockReturnValue({
            translate: jest.fn().mockResolvedValue(["Translated Text"]),
        }),
    },
}));
// 測試 translateText 函式
describe("translateText", () => {
    test("單一文字翻譯", async () => {
        const text = "Hello";
        const target = "zh-TW";
        const expected = ["Translated Text"];
        const result = await translateText(text, target);
        expect(result).toEqual(expected);
    });
});



// 測試 translateKeyword 函式
describe('translateKeyword', () => {
  test('驗證', async () => {
    const text = '貓';
    const result = await translateKeyword(text);

    expect(result).toEqual('cat 貓');
  });
});
