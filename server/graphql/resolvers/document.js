const Document = require("../../route/models/document");
const Tag = require("../../route/models/tag");
const Project = require("../../route/models/project");
const { documentFuzzySearch } = require("../search");
const dataToString = require("../../utils/dataToString");
const { getTag, getProject } = require("./merge");
const Dataloader = require("dataloader");

const documentLoader = new Dataloader((documentIDs) => {
    console.log("documentIDs", documentIDs);
    return Document.find({ _id: { $in: documentIDs } });
});

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
        documents: async (parent, { isDeleted }) => {
            try {
                const documents = await Document.find()
                    .populate("tags")
                    .where("isDeleted")
                    .equals(isDeleted);
                return documents.map(async (document) => {
                    return tarnsformDocument(document);
                });
            } catch (error) {
                throw error;
            }
        },
        document: async (parent, { id }) => {
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
                console.log("documents", documents)
                return documents.map(async (document) => {
                    return {
                        ...document,
                        // _id: document.+id,
                        created_at: dataToString(document.created_at),
                        updated_at: dataToString(document.updated_at),
                        tags:
                            document.tags?.length > 0
                                ? await Promise.all(document.tags.map((tagID) => getTag(tagID)))
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
            // console.log(args);
            try {
                const { title, content } = args.document;
                const document = new Document({
                    title,
                    content,
                });
                const newDocument = await document.save();
                return tarnsformDocument(newDocument);
            } catch (error) {
                throw error;
            }
        },
        updatedDocument: async (_, args) => {
            // console.log(args);
            try {
                const { _id, title, content, tags, project } = args.document;
                const updated_at = Date.now();
                const document = await Document.findByIdAndUpdate(
                    _id,
                    { title, content, updated_at, tags, project },
                    { new: true }
                ).populate("tags");

                const newDocument = await document.save();
                // console.log("newDocument", document);

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
                return { ...document._doc, _id: document.id };
            } catch (error) {
                throw error;
            }
        },
        permantDeleteDocument: async (_, args) => {
            try {
                const { _id } = args.document;
                const document = await Document.findByIdAndDelete(_id);
                if (!document) {
                    throw new Error(`Document with ID ${id} not found`);
                }
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
