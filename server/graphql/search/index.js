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
            $project: {
                __v: 0,
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
