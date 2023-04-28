const Document = require("../../models/document");
const Tag = require("../../models/tag");
const Project = require("../../models/project");
const User = require("../../models/user");
const { documentFuzzySearch, documentAutoComplete } = require("../search");
const dataToString = require("../../utils/dataToString");
const { translateKeyword } = require("../../utils/translate");
const {
    getTag,
    getProject,
    getUser,
    documentLoader,
    checkUserID,
} = require("./merge");
const { GraphQLError } = require("graphql");
const { deleteImage } = require("../../utils/bucket");
const { imageDetection } = require("../../utils/cloudVision");

function getAddDeleteUrls(oldArray, checkArray) {
    let add = [];
    let deleteUrls = [];

    for (let checkUrl of checkArray) {
        if (!oldArray.some((oldItem) => oldItem.url === checkUrl)) {
            add.push(checkUrl);
        }
    }

    for (let oldItem of oldArray) {
        if (!checkArray.includes(oldItem.url)) {
            deleteUrls.push(oldItem.url);
        }
    }

    return [add, deleteUrls];
}

const tarnsformDocument = async (document) => {
    return {
        ...document._doc,
        _id: document.id,
        created_at: dataToString(document._doc.created_at),
        updated_at: dataToString(document._doc.updated_at),
        user: document.user ? getProject.bind(this, document.user) : null,
        tags:
            document.tags?.length > 0
                ? await Promise.all(document.tags.map((tagID) => getTag(tagID)))
                : [],
        project: document.project
            ? getProject.bind(this, document.project)
            : null,
        images:
            document.images?.length > 0
                ? document.images?.map((image) => {
                      return {
                          ...image._doc,
                          created_at: dataToString(image.created_at),
                      };
                  })
                : [],
        user: document.user ? getUser.bind(this, document.user) : null,
    };
};
module.exports = {
    Query: {
        documents: async (parent, { isDeleted }, { isAuth, userID }) => {
            if (!isAuth) {
                // throw new Error("Unauthenticated");
            }

            try {
                const documents = userID
                    ? await Document.find().where("user").equals(userID)
                    : await Document.find();
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
            try {
                const document = await Document.findById(id);

                return tarnsformDocument(document);
            } catch (error) {
                throw new GraphQLError(`Document with ID ${id} not found`, {
                    extensions: { code: 400, id: id },
                });
            }
        },
        searchDocuments: async (parent, { keyword }, { isAuth, userID }) => {
            try {
                const translateKeywordResult = await translateKeyword(keyword);
                console.log(translateKeywordResult);
                const query = documentFuzzySearch(translateKeywordResult, userID);

                const documents = await Document.aggregate(query);
                

                return documents.map(async (document) => {
                    document.highlights.map((highlight) => {});

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
        autoComplete: async (parent, { keyword }, { isAuth, userID }) => {
            try {
                const query = documentAutoComplete(keyword, userID);

                const documents = await Document.aggregate(query);
                const keywords = documents.map((document) =>
                    document.highlights
                        .map((highlight) =>
                            highlight.texts
                                .filter((text) => text.type === "hit")
                                .map((text) => text.value)
                        )
                        .flat()
                );
                const flattenedArray = keywords.flat(); // flatten the nested array
                const uniqueArray = [...new Set(flattenedArray)]; // create a new Set with unique values, then convert it back to an array using the spread syntax
                const trimmedArray = uniqueArray.map((str) => {
                    return str.replace(/[。\n_\\*#='`]/g, "");
                });
                console.log(trimmedArray);
                return trimmedArray;
            } catch (error) {
                throw error;
            }
        },
    },
    Mutation: {
        createDocument: async (_, args, { isAuth, userID }) => {
            try {
                const { title, content } = args.document;
                const document = new Document({
                    title,
                    content,
                    user: userID,
                });
                const newDocument = await document.save();

                await User.findByIdAndUpdate(userID, {
                    $push: { documents: newDocument._id },
                });

                documentLoader.load(newDocument._id.toString());
                return tarnsformDocument(newDocument);
            } catch (error) {
                throw error;
            }
        },
        updatedDocument: async (_, args, { isAuth, userID }) => {
            try {
                const {
                    _id,
                    title,
                    tags,
                    project,
                    isArchived,
                    isFavorite,
                    user,
                } = args.document;

                console.log(project);
                const updated_at = Date.now();

                const documentded = await Document.findById(_id);

                checkUserID(documentded, userID);

                const document = await Document.findByIdAndUpdate(
                    _id,
                    {
                        title,
                        updated_at,
                        tags,
                        project: project !== "none" ? project : null,
                        isArchived,
                        isFavorite,
                        user,
                    },
                    { new: true }
                ).populate("tags");

                const newDocument = await document.save();

                if (user) {
                    await User.updateMany(
                        { _id: { $in: user } },
                        { $addToSet: { documents: _id } }
                    );
                    await User.updateMany(
                        { _id: { $nin: user } },
                        { $pull: { documents: _id } }
                    );
                }

                if (tags) {
                    console.log("tags!!!!!", tags);
                    await Tag.updateMany(
                        { _id: { $in: tags } },
                        { $addToSet: { document: _id } }
                    );
                    await Tag.updateMany(
                        { _id: { $nin: tags } },
                        { $pull: { document: _id } }
                    );
                }
                if (project === "none") {
                    await Project.updateMany(
                        { _id: { $in: documentded.project } },
                        { $pull: { documents: _id } }
                    );
                } else if (project) {
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
                console.log("newDocument", newDocument);

                return tarnsformDocument(newDocument);
            } catch (error) {
                throw error;
            }
        },
        updatedDocumentContent: async (_, args, { isAuth, userID }) => {
            try {
                console.log(args);
                const { id, content } = args;
                console.log("id", id);
                const updated_at = Date.now();
                const documentded = await Document.findById(id);

                checkUserID(documentded, userID);

                const pattern =
                    /!\[.*\]\((https?:\/\/[^\s)]+\.(?:jpg|png|jpeg))\)/g;

                let imageslist = documentded.images;
                console.log("imageslist", imageslist);
                let urls = [];
                for (let match of content.matchAll(pattern)) {
                    urls.push(match[1]);
                }

                const [add, dele] = getAddDeleteUrls(imageslist, urls);
                console.log("dele", dele);

                dele.map((url) => {
                    deleteImage(url);
                });

                for (let url of add) {
                    const autoTags = await imageDetection(url);
                    imageslist.push({
                        url: url,
                        name: "image",
                        autoTags: autoTags,
                    });
                }

                for (let url of dele) {
                    imageslist = imageslist.filter(
                        (image) => image.url !== url
                    );
                }
                const document = await Document.findByIdAndUpdate(
                    id,
                    { content, updated_at, images: imageslist },
                    { new: true }
                );
                documentLoader.clear(id.toString());

                return true;
            } catch (error) {
                console.log(error);
                return false;

                // throw error;
            }
        },

        deleteDocument: async (_, args, { isAuth, userID }) => {
            try {
                const { _id, isDeleted } = args.document;
                const document = await Document.findById(_id);
                checkUserID(document, userID);

                const newdocument = await Document.findByIdAndUpdate(
                    _id,
                    { isDeleted },
                    { new: true }
                );
                if (!newdocument) {
                    throw new Error(`Document with ID ${id} not found`);
                }
                documentLoader.clear(_id.toString());

                return { ...newdocument._doc, _id: newdocument.id };
            } catch (error) {
                throw error;
            }
        },
        permantDeleteDocument: async (_, { id }, { isAuth, userID }) => {
            try {
                const document = await Document.findById(id);
                checkUserID(document, userID);
                const permantDeleDocument = await Document.findByIdAndDelete(
                    id
                );

                if (!permantDeleDocument) {
                    throw new Error(`Document with ID ${id} not found`);
                }

                try {
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

                    //user
                    await User.updateMany(
                        { documents: { $in: id } },
                        { $pull: { documents: { $in: id } } }
                    );
                } catch {
                    throw new Error("Deleting document failed");
                }

                documentLoader.clear(id);

                return {
                    ...permantDeleDocument._doc,
                    _id: permantDeleDocument.id,
                };
            } catch (error) {
                throw error;
            }
        },
        permantDeleteALLDocument: async (_, args, { isAuth, userID }) => {
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
                try {
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

                    await User.updateMany(
                        {},
                        { $pull: { documents: { $in: deletedDocumentIds } } }
                    );
                } catch {}

                return result;
            } catch (error) {
                throw error;
            }
        },
    },
};
