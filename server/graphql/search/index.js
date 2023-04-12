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
            },
        },
        {
            $addFields: {
                score: {
                    $meta: "searchScore",
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
