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

const documentAutoComplete = (keyword, ID) => {
    return [
        {
            $search: {
                index: "defaultrfred",

                autocomplete: {
                    query: keyword,
                    path: "content",
                    tokenOrder: "any",
                    fuzzy: {
                        maxEdits: 1,
                        prefixLength: 2,
                        maxExpansions: 256,
                    },
                },

                highlight: {
                    path: "content",
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
        { $limit: 5 },
        {
            $match: {
                score: {
                    $gt: 0,
                },
                isDeleted: false,
                user: new mongoose.Types.ObjectId(ID),
            },
        },
        {
            $project: {
                title: 0,
                _id: 0,
                created_at: 0,
                content: 0,
                user: 0,
                isDeleted: 0,
                __v: 0,
                updated_at: 0,
                tags: 0,
                project: 0,
                isFavorite: 0,
                isArchived: 0,
                score: 0,
                images: 0,

            },
        },
    ];
};

module.exports = { documentFuzzySearch, documentAutoComplete };
