const Document = require("../../route/models/document");
const Tag = require("../../route/models/tag");
const Project = require("../../route/models/project");
const Dataloader = require("dataloader");
const dataToString = require("../../utils/dataToString");

// const documentLoader = new Dataloader((documentIDs) => {
//     console.log("documentIDs", documentIDs);
//     // return Promise.all(documentIDs.map(id => Document.findById(id).exec()));
//     // return Promise.all(documentIDs.map(id => Document.findById(id).exec()));
//     return Document.find({ _id: { $in: documentIDs } });

// });

const documentLoader = new Dataloader(async (documentIDs) => {
    console.log("documentIDs", documentIDs)
    try {
        const documents = await Document.find({
            _id: { $in: documentIDs },
        }).exec();
        // console.log(documents);
        const documentsMap = new Map(
            documents.map((doc) => [doc._id.toString(), doc])
        );
        return documentIDs.map((id) => documentsMap.get(id.toString()) || null);
    } catch (error) {
        throw error;
    }
});

// const tagLoader = new Dataloader((tagIDs) => {
//     // console.log("tagIDs", tagIDs);
//     // console.log("tagIDs", tagIDs);
//     // return Promise.all(tagIDs.map(id => Tag.findById(id).exec()));
//     return Tag.find({ _id: { $in: tagIDs } });
// });
const tagLoader = new Dataloader(async (tagIDs) => {
    console.log("tagIDs", tagIDs);
    try {
        const tags = await Tag.find({ _id: { $in: tagIDs } }).exec();
        const tagsMap = new Map(tags.map((tag) => [tag._id.toString(), tag]));
        return tagIDs.map((id) => tagsMap.get(id.toString()) || null);
    } catch (error) {
        throw error;
    }
});

const projectLoader = new Dataloader((projectIDs) => {
    // return Promise.all(projectIDs.map(id => Project.findById(id).exec()));
    return Project.find({ _id: { $in: projectIDs } });
});

const transformProject = async (project) => {
    return {
        ...project._doc,
        _id: project.id,
        created_at: new Date(project._doc.created_at).toISOString(),
        updated_at: new Date(project._doc.updated_at).toISOString(),
        documents:
            project.documents?.length > 0
                ? await Promise.all(project.documents.map(getDocument))
                : [],
    };
};
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
const transformTag = async (tag) => {
    return {
        ...tag._doc,
        _id: tag.id,
        created_at: dataToString(tag._doc.created_at),
        document:
            tag.document?.length > 0
                ? await Promise.all(tag.document.map(getDocument))
                : [],
    };
};

const getDocument = async (documentID) => {
    // console.log(documentID.toString());
    try {
        // const document = await Document.findById(documentID);
        const document = await documentLoader.load(documentID._id.toString());

        if (!document) {
            return;

            // throw new Error(`Document with ID ${documentID} not found`);
        }
        // console.log("YA")
        const tags = [];
        if (document.tags.length > 0) {
            for (const tagID of document.tags) {
                // console.log("tagID", tagID)
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
        // const project = await Project.findById(projectID);
        const project = await projectLoader.load(projectID.toString());
        if (!project) {
            throw new Error(`Project with ID ${projectID} not found`);
        }
        const documents = await Promise.all(
            project.documents.map((documentID) => getDocument(documentID))
        );
        return {
            ...project._doc,
            _id: project._id,
            created_at: dataToString(project._doc.created_at),
            documents: documents,
        };
    } catch (error) {
        throw error;
    }
};

const getTag = async (tagID) => {
    console.log("singel tagID", tagID._id);
    // console.log("hi");

    try {
        // const tag = await Tag.find({ tags: { $in: tagID } });

        // const tag = await Tag.findById(tagID).exec();
        const tag = await tagLoader.load(tagID._id.toString());
        // console.log(tag);

        if (!tag) {
            // throw new Error(`Tag with ID ${tagID} not found`);
            return;
        }
        // const documents = [];
        // for (let i = 0; i < tag.document.length; i++) {
        //     const documentID = tag.document[i]._id;
        //     const document = await getDocument(documentID);
        //     documents.push(document);
        // }

        // console.log(tag.document);
        return {
            ...tag._doc,
            _id: tag._id,
            // documents: documents,
        };
    } catch (error) {
        throw error;
    }
};
const documents = async (parent) => {
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
};
const tags = async (parent, args, context, info) => {
    // console.log("parent", parent);
    try {
        const tags = await Tag.find();
        return tags.map(async (tag) => {
            return transformTag(tag);
        });
    } catch (error) {
        throw error;
    }
};

exports.getDocument = getDocument;
exports.getProject = getProject;
exports.getTag = getTag;
