// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.

const Article = require("../../route/models/article");
const Document = require("../../route/models/document");

const Resolvers = {
    Query: {
        articles: async () => {
            try {
                const articlesFetched = await Article.find();
                return articlesFetched.map((article) => {
                    return {
                        ...article._doc,
                        _id: article.id,
                        createdAt: new Date(
                            article._doc.createdAt
                        ).toISOString(),
                    };
                });
            } catch (error) {
                throw error;
            }
        },
        documents: async () => {
            try {
                const documentsFetched = await Document.find().where({isDeleted: false});
                return documentsFetched.map((document) => {
                    return {
                        ...document._doc,
                        _id: document.id,
                        created_at: new Date(
                            document._doc.created_at
                        ).toISOString(),
                        updated_at: new Date(
                            document._doc.updated_at
                        ).toISOString(),
                    };
                });
            } catch (error) {
                throw error;
            }
        },
        document: async (parent, { id }) => {
            try {
                const document = await Document.findById(id);
                if (!document) {
                    throw new Error(`Document with ID ${id} not found`);
                }
                return {
                    ...document._doc,
                    _id: document.id,
                    created_at: new Date(
                        document._doc.created_at
                    ).toISOString(),
                    updated_at: new Date(
                        document._doc.updated_at
                    ).toISOString(),
                };
            } catch (error) {
                throw error;
            }
        },
    },
    Mutation: {
        createArticle: async (_, args) => {
            console.log(args);
            try {
                const { title, body } = args.article;
                const article = new Article({
                    title,
                    body,
                });
                const newArticle = await article.save();
                return { ...newArticle._doc, _id: newArticle.id };
            } catch (error) {
                throw error;
            }
        },
        createDocument: async (_, args) => {
            console.log(args);
            try {
                const { title, content } = args.document;
                const document = new Document({
                    title,
                    content,
                });
                const newDocument = await document.save();
                return { ...newDocument._doc, _id: newDocument.id };
            } catch (error) {
                throw error;
            }
        },
        updatedDocument: async (_, args) => {
            console.log(args);
            try {
                const { _id, title, content } = args.document;
                const updated_at = Date.now();
                const document = await Document.findByIdAndUpdate(
                    _id,
                    { title, content, updated_at },
                    { new: true }
                );

                const newDocument = await document.save();
                console.log("newDocument");
                return { ...newDocument._doc, _id: newDocument.id };
            } catch (error) {
                console.log("??");

                throw error;
            }
        },
        deleteDocument: async (_, args) => {
            console.log(args);

            try {
                const { _id, isDeleted } = args.document;
                console.log(_id, isDeleted)
                const document = await Document.findByIdAndUpdate(
                    _id,
                    { isDeleted },
                    { new: true }
                );
                if (!document) {
                    throw new Error(`Document with ID ${id} not found`);
                }
                return { ...document._doc, _id: document.id };
            } catch (error) {
                throw error;
            }
        }
    },
};

module.exports = { Resolvers };
