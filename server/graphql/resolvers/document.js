const Document = require("../../route/models/document");
const Tag = require("../../route/models/tag");
const Project = require("../../route/models/project");
const { documentFuzzySearch } = require("../search");
const dataToString = require("../../utils/dataToString");
const { getTag, getProject } = require("./merge");
const { documentLoader } = require("./merge");
const tarnsformDocument = async (document) => {
    return {
        ...document._doc,
        _id: document.id,
        created_at: dataToString(document._doc.created_at),
        updated_at: dataToString(document._doc.updated_at),
        tags:
            document.tags?.length > 0
                ? await Promise.all(document.tags.map((tagID) => getTag(tagID)))
                : [],
        project: document.project
            ? getProject.bind(this, document.project)
            : null,
    };
};

module.exports = {
    Query: {
        documents: async (parent, { isDeleted }, _, info) => {
            try {
                const documents = await Document.find().populate("tags");
                // .where("isDeleted")
                // .equals(isDeleted);
                return documents.map(async (document) => {
                    return tarnsformDocument(document);
                });
            } catch (error) {
                throw error;
            }
        },
        document: async (parent, { id }, _, info) => {
            console.log("here");

            try {
                const document = await Document.findById(id);
                // const document1 = await Document.find({ _id: { $in: id } });

                // console.log("document", document);
                if (!document) {
                    throw new Error(`Document with ID ${id} not found`);
                }
                return tarnsformDocument(document);
            } catch (error) {
                throw error;
            }
        },
        searchDocuments: async (parent, { keyword }) => {
            try {
                const query = documentFuzzySearch(keyword);
                const documents = await Document.aggregate(query);
                return documents.map(async (document) => {
                    console.log("document", document.highlights);
                    document.highlights.map((highlight) => {
                        console.log("highlight", highlight.texts);
                    });

                    return {
                        ...document,
                        created_at: dataToString(document.created_at),
                        updated_at: dataToString(document.updated_at),
                        tags:
                            document.tags?.length > 0
                                ? await Promise.all(
                                      document.tags.map((tagID) =>
                                          getTag(tagID)
                                      )
                                  )
                                : [],
                        project: document.project
                            ? getProject.bind(this, document.project)
                            : null,
                    };
                });
            } catch (error) {
                throw error;
            }
        },
    },
    Mutation: {
        createDocument: async (_, args) => {
            try {
                const { title, content } = args.document;
                const document = new Document({
                    title,
                    content,
                });
                const newDocument = await document.save();
                documentLoader.load(newDocument._id.toString());
                return tarnsformDocument(newDocument);
            } catch (error) {
                throw error;
            }
        },
        updatedDocument: async (_, args) => {
            console.log("there");

            try {
                const {
                    _id,
                    title,
                    content,
                    tags,
                    project,
                    isArchived,
                    isFavorite,
                } = args.document;
                const updated_at = Date.now();
                const document = await Document.findByIdAndUpdate(
                    _id,
                    {
                        title,
                        content,
                        updated_at,
                        tags,
                        project,
                        isArchived,
                        isFavorite,
                    },
                    { new: true }
                ).populate("tags");

                const newDocument = await document.save();

                if (tags) {
                    await Tag.updateMany(
                        { _id: { $in: tags } },
                        { $addToSet: { document: _id } }
                    );
                    await Tag.updateMany(
                        { _id: { $nin: tags } },
                        { $pull: { document: _id } }
                    );
                }
                if (project) {
                    await Project.updateMany(
                        { _id: { $in: project } },
                        { $addToSet: { documents: _id } }
                    );
                    await Project.updateMany(
                        { _id: { $nin: project } },
                        { $pull: { documents: _id } }
                    );
                }
                documentLoader.clear(_id.toString());

                return tarnsformDocument(newDocument);
            } catch (error) {
                console.log("??");

                throw error;
            }
        },
        deleteDocument: async (_, args) => {
            // console.log(args);

            try {
                const { _id, isDeleted } = args.document;
                // console.log(_id, isDeleted);
                const document = await Document.findByIdAndUpdate(
                    _id,
                    { isDeleted },
                    { new: true }
                );
                if (!document) {
                    throw new Error(`Document with ID ${id} not found`);
                }
                documentLoader.clear(_id.toString());

                return { ...document._doc, _id: document.id };
            } catch (error) {
                throw error;
            }
        },
        permantDeleteDocument: async (_, { id }) => {
            try {
                const document = await Document.findByIdAndDelete(id);

                console.log("document", document);
                if (!document) {
                    throw new Error(`Document with ID ${id} not found`);
                }
                //tags
                await Tag.updateMany(
                    { document: { $in: id } },
                    { $pull: { document: { $in: id } } }
                );
                //project
                await Project.updateMany(
                    { documents: { $in: id } },
                    { $pull: { documents: { $in: id } } }
                );
                documentLoader.clear(_id.toString());

                return { ...document._doc, _id: document.id };
            } catch (error) {
                throw error;
            }
        },
        permantDeleteALLDocument: async (_, args) => {
            try {
                const { isDeleted } = args.document;
                const deletedDocuments = await Document.find({ isDeleted });
                const deletedDocumentIds = deletedDocuments.map(
                    (doc) => doc._id
                );
                const result = [];
                for (const id of deletedDocumentIds) {
                    const document = await Document.findByIdAndDelete(id);
                    if (!document) {
                        throw new Error(`Document with ID ${id} not found`);
                    }
                    documentLoader.clear(id.toString());
                    result.push(id);
                }

                //tags
                await Tag.updateMany(
                    { document: { $in: deletedDocumentIds } },
                    { $pull: { document: { $in: deletedDocumentIds } } }
                );
                //project
                await Project.updateMany(
                    { documents: { $in: deletedDocumentIds } },
                    { $pull: { documents: { $in: deletedDocumentIds } } }
                );

                return result;
            } catch (error) {
                throw error;
            }
        },
    },
};
