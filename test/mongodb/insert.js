const User = require("./user");
const Article = require("./article");

const mongoose = require("mongoose");
const url = "mongodb+srv://orin:a29377053@notesmall.q5kvnpl.mongodb.net/test";
mongoose.connect(url);
const article = `你好啊，我很好`;
async function run() {
    try {
        // console.time("start");
        const user = await User.create({
            name: "jason",
            age: 12,
            article: article,
        });
        console.log(user);

        await user.save();
        // console.timeEnd("start");

        // console.log(user);
    } catch (e) {
        console.error(e.message);
    }
}
async function userfind() {
    try {
        console.time("start");
        const user = await User.find().where("name").equals("orin");

        console.log(user);
        console.timeEnd("start");
    } catch (e) {
        console.error(e.message);
    }
}

async function fuzzySearch(keyword) {
    try {
        const user = await User.aggregate([
            {
                $search: {
                    index: "fuzzy_test",
                    text: {
                        query: keyword,
                        path: ["name", "age", "article"],
                        // fuzzy: {},
                    },
                    // fuzzy: {},
                    highlight: { path: ["name", "age", "article"] },
                },
            },
            {
                $addFields: {
                    score: {
                        $meta: "searchScore",
                    },
                    highlights: {
                        $meta: "searchHighlights",
                    },
                },
            },
            {
                $project: {
                    // "description": 1,
                    _id: 0,
                    __v: 0,
                },
            },
            {
                $match: {
                    score: {
                        $gt: 0,
                    },
                },
            },
        ]);
        console.log(user);
        // console.log(user[0].highlights[0]);
    } catch (e) {
        console.log(e.message);
    }
}
async function runArticle() {
    try {
        const article = await Article.create({
            title: "jason",
            body: "dede",
        });
        console.log(article);

        await article.save();
    } catch (e) {
        console.error(e.message);
    }
}

async function findArticle() {
    try {
        const article = await Article.find().where("title").equals("frfr");
        console.log(article);
    } catch (e) {
        console.error(e.message);
    }
}
// run();
runArticle();
// findArticle();
// userfind();
// fuzzySearch("orin");


