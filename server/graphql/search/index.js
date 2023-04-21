
const mongoose = require("mongoose");

const documentFuzzySearch = (keyword, ID) => {
    return [
        {
            $search: {
                index: "notesmall_document",
                text: {
                    query: keyword,
                    path: {
                        wildcard: "*",
                    },
                },
                highlight: {
                    path: {
                        wildcard: "*",
                    },
                },
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
            $match: {
                score: {
                    $gt: 0,
                },
                isDeleted: false,
                user: new mongoose.Types.ObjectId(ID),
            },
        },
    ];
};

module.exports = { documentFuzzySearch };
