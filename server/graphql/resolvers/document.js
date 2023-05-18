const Document = require("../../models/document");
const Tag = require("../../models/tag");
const Project = require("../../models/project");
const User = require("../../models/user");
const { documentFuzzySearch, documentAutoComplete } = require("../search");
const dataToString = require("../../utils/dataToString");
const { translateKeyword } = require("../../utils/translate");
const { getTag, getProject, getUser } = require("./merge");
const {
    documentLoader,
    tagLoader,
    projectLoader,
    clearCache,
} = require("../dataloader");
const { deleteImage } = require("../../utils/bucket");
const { imageDetection } = require("../../utils/cloudVision");
const {
    InternalServerError,
    DocumentNotFoundError,
    NotAuthError,
    DetectImageError,
} = require("../errorHandler");
const logger = require("../../utils/logger");

function getAddDeleteUrls(oldArray, checkArray) {
    let newUrls = [];
    let deleteUrls = [];

    for (let checkUrl of checkArray) {
        if (!oldArray.some((oldItem) => oldItem.url === checkUrl)) {
            newUrls.push(checkUrl);
        }
    }

    for (let oldItem of oldArray) {
        if (!checkArray.includes(oldItem.url)) {
            deleteUrls.push(oldItem.url);
        }
    }

    return [newUrls, deleteUrls];
}
const transformDocument = async (document) => {
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
        document: async (_, { id }, { userID }) => {
            try {
                let document;

                // fetch Document

                try {
                    document = await Document.findById(id);
                } catch (error) {
                    return new DocumentNotFoundError(
                        id,
                        error,
                        `Document with ID ${id} not found `
                    );
                }

                // check if user is authorized to view document

                const { user } = document;

                if (!user || user.toString() !== userID) {
                    return new NotAuthError(
                        userID,
                        `You do not have permission to view this document`,
                        "document",
                        id.toString()
                    );
                }
                logger.info(
                    "Fetching document",
                    `Document ID ${id} has been fetched by user ID ${userID}`
                );

                return transformDocument(document);
            } catch (error) {
                return new InternalServerError(
                    error,
                    "Document retrieval error"
                );
            }
        },
        searchDocuments: async (_, { keyword }, { userID }) => {
            try {
                const translateKeywordResult = await translateKeyword(keyword);

                const query = documentFuzzySearch(
                    translateKeywordResult,
                    userID
                );

                const documents = await Document.aggregate(query);

                return documents.map(async (document) => {
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
                return new InternalServerError(
                    error,
                    "searchDocuments retrieval error"
                );
            }
        },
        autoComplete: async (_, { keyword }, { userID }) => {
            try {
                const query = documentAutoComplete(keyword, userID);

                const documents = await Document.aggregate(query);


                const keywords = documents
                    .map((document) =>
                        document.highlights
                            .map((highlight) =>
                                highlight.texts
                                    .filter((text) => text.type === "hit")
                                    .map((text) => text.value)
                            )
                            .flat()
                    )
                    .flat();

                // create a new Set with unique values, then convert it back to an array using the spread syntax

                const uniqueArray = [...new Set(keywords)];
                const trimmedArray = uniqueArray.map((str) => {
                    return str.replace(/[。\n_\\*#='`]/g, "");
                });

                return trimmedArray;
            } catch (error) {
                return new InternalServerError(
                    error,
                    "autoComplete retrieval error"
                );
            }
        },
    },
    Mutation: {
        createDocument: async (_, args, { userID }) => {
            try {
                const { title, content } = args.document;
                const document = new Document({
                    title,
                    content,
                    user: userID,
                });

                let newDocument;

                try {
                    newDocument = await document.save();

                    await User.findByIdAndUpdate(userID, {
                        $push: { documents: newDocument._id },
                    });
                } catch (error) {
                    return new InternalServerError(
                        error,
                        "Access database to create document error ."
                    );
                }

                documentLoader.load(newDocument._id.toString());

                logger.info(
                    "Creating document",
                    `Document ID ${newDocument._id} has been created by user ID ${userID}`
                );

                return transformDocument(newDocument);
            } catch (error) {
                return new InternalServerError(
                    error,
                    "createDocument retrieval error"
                );
            }
        },
        updatedDocument: async (_, args, { userID }) => {
            try {
                const { _id, title, tags, project, isArchived, isFavorite } =
                    args.document;

                const updated_at = Date.now();

                // check if the document exists

                let waitForUpdateDocument;

                try {
                    waitForUpdateDocument =
                        (await documentLoader.load(_id.toString())) ||
                        (await Document.findById(_id));
                } catch (error) {
                    return new DocumentNotFoundError(
                        _id,
                        error,
                        `Document with ID ${_id} not found `
                    );
                }

                const user = waitForUpdateDocument.user?.toString();
                const oldProject = waitForUpdateDocument.project?.toString();
                const oldTags = waitForUpdateDocument.tags?.map((tag) =>
                    tag.toString()
                );

                // check if user is authorized to update document

                if (user !== userID) {
                    return new NotAuthError(
                        userID,
                        `You do not have permission to update this document`,
                        "document",
                        _id.toString()
                    );
                }

                // update document

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
                );

                const newDocument = await document.save();

                // update tags and project if they are changed

                if (tags) {
                    await Promise.all([
                        Tag.updateMany(
                            { _id: { $in: tags } },
                            { $addToSet: { document: _id } }
                        ),
                        Tag.updateMany(
                            { _id: { $nin: tags } },
                            { $pull: { document: _id } }
                        ),
                    ]);

                    clearCache(tags, tagLoader);
                    clearCache(oldTags, tagLoader);
                }

                if (project === "none") {
                    await Project.updateMany(
                        { _id: { $in: oldProject } },
                        { $pull: { documents: _id } }
                    );
                    clearCache(oldProject, projectLoader);
                    
                } else if (project) {
                    await Promise.all([
                        Project.updateMany(
                            { _id: { $in: project } },
                            { $addToSet: { documents: _id } }
                        ),
                        Project.updateMany(
                            { _id: { $nin: project } },
                            { $pull: { documents: _id } }
                        ),
                    ]);

                    clearCache(project, projectLoader);
                    clearCache(oldProject, projectLoader);
                }

                // clear cache
                clearCache(_id, documentLoader);

                logger.info(
                    "Updating document",
                    `Document ID ${_id} has been updated by user ID ${userID}`
                );

                return transformDocument(newDocument);
            } catch (error) {
                return new InternalServerError(
                    error,
                    "updatedDocument retrieval error"
                );
            }
        },
        updatedDocumentContent: async (_, args, { userID }) => {
            try {
                const { id, content } = args;
                const updated_at = Date.now();

                let waitForUpdateDocument;

                try {
                    waitForUpdateDocument =
                        (await documentLoader.load(id.toString())) ||
                        (await Document.findById(id));
                } catch (error) {
                    return new DocumentNotFoundError(
                        id,
                        error,
                        `Document with ID ${id} not found `
                    );
                }

                const user = waitForUpdateDocument.user?.toString();

                if (user !== userID) {
                    return new NotAuthError(
                        userID,
                        `You do not have permission to update this document`,
                        "document",
                        id.toString()
                    );
                }

                try {
                    const pattern =
                        /!\[.*\]\((https?:\/\/[^\s)]+\.(?:jpg|png|jpeg))\)/g;

                    let { images } = waitForUpdateDocument;
                    const newImagesUrls = Array.from(
                        content.matchAll(pattern),
                        (match) => match[1]
                    );

                    const [add, dele] = getAddDeleteUrls(images, newImagesUrls);

                    // delete images from s3 and remove from imagesList
                    await Promise.all(dele.map((url) => deleteImage(url)));

                    for (let url of dele) {
                        images = images.filter((image) => image.url !== url);
                    }

                    // add new images to imagesList and detect image tags

                    const newImagesList = await Promise.all(
                        add.map(async (url) => {
                            const autoTags = await imageDetection(url);
                            return {
                                url,
                                name: url.split("/").pop(),
                                autoTags,
                            };
                        })
                    );

                    images = [...images, ...newImagesList];

                    await Document.findByIdAndUpdate(
                        id,
                        { content, updated_at, images },
                        { new: true }
                    );
                } catch (error) {
                    return new DetectImageError(
                        error,
                        `${id}Detect image error`
                    );
                }

                clearCache(id, documentLoader);

                return true;
            } catch (error) {
                return new InternalServerError(
                    error,
                    "updatedDocumentContent retrieval error"
                );
            }
        },

        deleteDocument: async (_, args, { userID }) => {
            try {
                const { _id, isDeleted } = args.document;

                let waitForDeleteDocument;

                try {
                    waitForDeleteDocument =
                        (await documentLoader.load(_id.toString())) ||
                        (await Document.findById(_id));
                } catch (error) {
                    return new DocumentNotFoundError(
                        _id,
                        error,
                        `Document with ID ${_id} not found `
                    );
                }

                const user = waitForDeleteDocument.user?.toString();

                if (user !== userID) {
                    return new NotAuthError(
                        userID,
                        `You do not have permission to delete this document`,
                        "document",
                        _id.toString()
                    );
                }

                await Document.findByIdAndUpdate(
                    {
                        _id,
                        user: userID,
                    },
                    { isDeleted },
                    { new: true }
                );

                clearCache(_id, documentLoader);

                logger.info(
                    "Deleting document",
                    `Document ID ${_id} has been deleted by user ID ${userID}`
                );

                return {
                    ...waitForDeleteDocument._doc,
                    _id: waitForDeleteDocument.id,
                };
            } catch (error) {
                return new InternalServerError(
                    error,
                    "deleteDocument retrieval error"
                );
            }
        },
        permanentDeleteDocument: async (_, { id }, { userID }) => {
            try {
                // fetch document from cache or database

                let permanentDeleDocument;

                try {
                    permanentDeleDocument =
                        (await documentLoader.load(id.toString())) ||
                        (await Document.findById(id));
                } catch (error) {
                    return new DocumentNotFoundError(
                        id,
                        error,
                        `Document with ID ${id} not found `
                    );
                }

                // check if document exist and user is owner

                if (permanentDeleDocument.user.toString() !== userID) {
                    return new NotAuthError(
                        userID,
                        `You do not have permission to delete this document`,
                        "document",
                        id.toString()
                    );
                }

                // delete document and remove from tags, projects, users

                await Promise.all([
                    Document.findByIdAndDelete(id).lean(),
                    Tag.updateMany(
                        { document: { $in: id } },
                        { $pull: { document: { $in: id } } }
                    ),
                    Project.updateMany(
                        { documents: { $in: id } },
                        { $pull: { documents: { $in: id } } }
                    ),
                    User.updateMany(
                        { documents: { $in: id } },
                        { $pull: { documents: { $in: id } } }
                    ),
                ]);

                // clear cache

                clearCache(id, documentLoader);
                clearCache(permanentDeleDocument.tags, tagLoader);
                clearCache(permanentDeleDocument.project, projectLoader);

                logger.info(
                    "Permanent deleting document",
                    `Document ID ${id} has been permanently deleted by ${userID}`
                );

                return permanentDeleDocument;
            } catch (error) {
                return new InternalServerError(
                    error,
                    "permanentDeleteDocument retrieval error"
                );
            }
        },
    },
};
