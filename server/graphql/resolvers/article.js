const Article = require("../../route/models/article");
const dataToString = require("../../utils/dataToString");

module.exports = {
    Query: {
        articles: async (parent,{},context,info) => {
            console.log("context", context)
            console.log("info", info)
            console.log("parent", parent)

            try {
                const articles = await Article.find();
                // console.log("articles", articles);

                return articles.map(async (article) => {
                    return {
                        ...article._doc,
                        _id: article.id,
                        createdAt: dataToString(article._doc.createdAt),
                    };
                });
            } catch (error) {
                throw error;
            }
        },
    },
};
