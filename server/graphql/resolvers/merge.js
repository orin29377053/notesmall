const Document = require("../../route/models/document");
const Tag = require("../../route/models/tag");
const Project = require("../../route/models/project");
const Dataloader = require("dataloader");
const dataToString = require("../../utils/dataToString");



const documentLoader = new Dataloader(async (documentIDs) => {
    // console.log("documentIDs", documentIDs)
    try {
        documentLoader.clearAll();

        const documents = await Document.find({
            _id: { $in: documentIDs },
        }).exec();
        // console.log(documents);
        const documentsMap = new Map(
            documents.map((doc) => [doc._id.toString(), doc])
        );
        // console.log("documentsMap", documentsMap);
        return documentIDs.map((id) => documentsMap.get(id.toString()) || null);
    } catch (error) {
        throw error;
    }
});

const tagLoader = new Dataloader(async (tagIDs) => {

    // console.log("tagIDs", tagIDs);
    try {
        tagLoader.clearAll();
        const tags = await Tag.find({ _id: { $in: tagIDs } }).exec();
        const tagsMap = new Map(tags.map((tag) => [tag._id.toString(), tag]));
        return tagIDs.map((id) => tagsMap.get(id.toString()) || null);
    } catch (error) {
        throw error;
    }
});

const projectLoader = new Dataloader((projectIDs) => {
    console.log("projectIDs", projectIDs);
    // return Promise.all(projectIDs.map(id => Project.findById(id).exec()));
    return Project.find({ _id: { $in: projectIDs } });
});

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
        // console.log("OK");
// 
        return {
            ...document._doc,
            created_at: dataToString(document._doc.created_at),
            updated_at: dataToString(document._doc.updated_at),
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
    // console.log("singel tagID", tagID._id);

    // console.log("hi");

    try {
        // const tags = await Tag.find({ _id: { $in: [tagID._id.toString()] } });
        // const tag=tags[0];

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


exports.getDocument = getDocument;
exports.getProject = getProject;
exports.getTag = getTag;
exports.documentLoader = documentLoader;
exports.projectLoader = projectLoader;
exports.tagLoader = tagLoader;
