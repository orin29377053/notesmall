// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.

const Article = require("../../route/models/article");
const Document = require("../../route/models/document");
const Tag = require("../../route/models/tag");
const Project = require("../../route/models/project");
const { documentFuzzySearch } = require("../search");

const getDocument = async (documentID) => {
    console.log("dwd");
    try {
        const document = await Document.findById(documentID).populate("tags");
        if (!document) {
            throw new Error(`Document with ID ${documentID} not found`);
        }
        const tags = [];
        if (document.tags.length > 0) {
            for (const tagID of document.tags) {
                const tag = await getTag(tagID._id);
                tags.push(tag);
            }
        }
        // console.log(tags);

        return {
            ...document._doc,
            _id: document._id,
            project: getProject.bind(this, document.project),
            tags: tags,
        };
    } catch (error) {
        throw error;
    }
};

const getProject = async (projectID) => {
    try {
        const project = await Project.findById(projectID);
        if (!project) {
            throw new Error(`Project with ID ${projectID} not found`);
        }
        const documents = await Promise.all(
            project.documents.map((documentID) => getDocument(documentID))
        );
        return {
            ...project._doc,
            _id: project._id,
            documents: documents,
        };
    } catch (error) {
        throw error;
    }
};

const getTag = async (tagID) => {
    console.log("hi");
    try {
        const tag = await Tag.findById(tagID).exec();
        console.log(tag.document);
        if (!tag) {
            throw new Error(`Tag with ID ${tagID} not found`);
        }
        // const documents = [];
        // for (let i = 0; i < tag.document.length; i++) {
        //     const documentID = tag.document[i]._id;
        //     const document = await getDocument(documentID);
        //     documents.push(document);
        // }
        return {
            ...tag._doc,
            _id: tag._id,
            // documents: documents,
        };
    } catch (error) {
        throw error;
    }
};

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
        documents: async (parent, { isDeleted }) => {
            try {
                const documents = await Document.find()
                    .where({
                        isDeleted: isDeleted,
                    })
                    .populate("tags");
                console.log("documents", documents);
                return documents.map(async (document) => {
                    return {
                        ...document._doc,
                        _id: document.id,
                        created_at: new Date(
                            document._doc.created_at
                        ).toISOString(),
                        updated_at: new Date(
                            document._doc.updated_at
                        ).toISOString(),
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
        document: async (parent, { id }) => {
            try {
                const document = await Document.findById(id);
                console.log("document", document);
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
                    tags:
                        document.tags?.length > 0
                            ? await Promise.all(
                                  document.tags.map((tagID) => getTag(tagID))
                              )
                            : [],
                    project: document.project
                        ? getProject.bind(this, document.project)
                        : null,
                };
            } catch (error) {
                throw error;
            }
        },
        searchDocuments: async (parent, { keyword }) => {
            try {
                console.log(keyword);
                const query = documentFuzzySearch(keyword);
                const documents = await Document.aggregate(query);
                console.log("dSSWSocuments", documents);
                // console.log(documents[0].highlights[0])
                return documents.map(async (document) => {
                    return {
                        ...document,
                        _id: document._id,
                        created_at: new Date(document.created_at).toISOString(),
                        updated_at: new Date(document.updated_at).toISOString(),
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
        tag: async (parent, { id }, context, info) => {
            console.log(parent,context, info);
            try {
                const tag = await Tag.findById(id);
                if (!tag) {
                    throw new Error(`Tag with ID ${id} not found`);
                }
                return {
                    ...tag._doc,
                    _id: tag.id,
                    created_at: new Date(tag._doc.created_at).toISOString(),
                    document:
                        tag.document?.length > 0
                            ? await Promise.all(tag.document.map(getDocument))
                            : [],
                };
            } catch (error) {
                throw error;
            }
        },
        tags: async (parent, args, context, info) => {
            console.log("parent", parent)
            try {
                const tags = await Tag.find();
                return tags.map(async (tag) => {
                    return {
                        ...tag._doc,
                        _id: tag.id,
                        created_at: new Date(tag._doc.created_at).toISOString(),
                        document:
                            tag.document?.length > 0
                                ? await Promise.all(
                                      tag.document.map(getDocument)
                                  )
                                : [],
                    };
                });
            } catch (error) {
                throw error;
            }
        },
        project: async (parent, { id }) => {
            try {
                const project = await Project.findById(id);
                if (!project) {
                    throw new Error(`Project with ID ${id} not found`);
                }
                return {
                    ...project._doc,
                    _id: project.id,
                    created_at: new Date(project._doc.created_at).toISOString(),
                    updated_at: new Date(project._doc.updated_at).toISOString(),
                    documents:
                        project.documents?.length > 0
                            ? await Promise.all(
                                  project.documents.map(getDocument)
                              )
                            : [],
                };
            } catch (error) {
                throw error;
            }
        },
        projects: async () => {
            try {
                const projects = await Project.find();
                return projects.map(async (project) => {
                    return {
                        ...project._doc,
                        _id: project.id,
                        created_at: new Date(
                            project._doc.created_at
                        ).toISOString(),
                        updated_at: new Date(
                            project._doc.updated_at
                        ).toISOString(),
                        documents:
                            project.documents?.length > 0
                                ? await Promise.all(
                                      project.documents.map(getDocument)
                                  )
                                : [],
                    };
                });
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
                const { _id, title, content, tags, project } = args.document;
                console.log(_id,tags);
                const updated_at = Date.now();
                const document = await Document.findByIdAndUpdate(
                    _id,
                    { title, content, updated_at, tags, project },
                    { new: true }
                ).populate("tags");

                const newDocument = await document.save();
                console.log("newDocument");

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

                return {
                    ...newDocument._doc,
                    _id: newDocument.id,
                    tags:
                        document.tags?.length > 0
                            ? await Promise.all(
                                  document.tags.map((tagID) => getTag(tagID))
                              )
                            : [],
                    project: document.project
                        ? getProject.bind(this, document.project)
                        : null,
                };
            } catch (error) {
                console.log("??");

                throw error;
            }
        },
        deleteDocument: async (_, args) => {
            console.log(args);

            try {
                const { _id, isDeleted } = args.document;
                console.log(_id, isDeleted);
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
        createTag: async (_, args) => {
            console.log("args", args);
            try {
                const { name, colorCode } = args.tag;
                const tag = new Tag({
                    name,
                    colorCode,
                });
                const newTag = await tag.save();
                return { ...newTag._doc, _id: newTag.id };
            } catch (error) {
                throw error;
            }
        },
        updatedTag: async (_, args) => {
            console.log(args);
            try {
                const { _id, name, colorCode, document } = args.tag;
                const tag = await Tag.findByIdAndUpdate(
                    _id,
                    { name, colorCode, document },
                    { new: true }
                );
                if (!tag) {
                    throw new Error(`Tag with ID ${id} not found`);
                }
                return {
                    ...tag._doc,
                    _id: tag.id,
                    document:
                        tag.document?.length > 0
                            ? await Promise.all(tag.document.map(getDocument))
                            : [],
                };
            } catch (error) {
                throw error;
            }
        },
        deleteTag: async (_, args) => {
            console.log(args);
            try {
                const { id } = args;
                const tag = await Tag.findByIdAndDelete(id);
                console.log(tag);

        
                if (!tag) {
                    throw new Error(`Tag with ID ${id} not found`);
                }
                //pull from document
                await Document.updateMany(
                    { _id: { $in: tag.document } },
                    { $pull: { tags: id } }
                );


                return {
                    ...tag._doc,
                    _id: tag.id,
                    document:
                        tag.document?.length > 0
                            ? await Promise.all(tag.document.map(getDocument))
                            : [],
                };
            } catch (error) {
                throw error;
            }
        },








        createProject: async (_, args) => {
            console.log(args);
            try {
                const { name, description } = args.project;
                const project = new Project({
                    name,
                    description,
                });
                const newProject = await project.save();
                return { ...newProject._doc, _id: newProject.id };
            } catch (error) {
                throw error;
            }
        },
    },
};

module.exports = { Resolvers };
