const documentFuzzySearch = (keyword) => {
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
            },
        },
    ];
};

module.exports = { documentFuzzySearch };
