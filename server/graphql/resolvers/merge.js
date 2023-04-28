const Document = require("../../models/document");
const Tag = require("../../models/tag");
const Project = require("../../models/project");
const Dataloader = require("dataloader");
const dataToString = require("../../utils/dataToString");
const User = require("../../models/user");

const documentLoader = new Dataloader(async (documentIDs) => {

    try {
        // documentLoader.clearAll();

        const documents = await Document.find({
            _id: { $in: documentIDs },
        }).exec();
        const documentsMap = new Map(
            documents.map((doc) => [doc._id.toString(), doc])
        );
        return documentIDs.map((id) => documentsMap.get(id.toString()) || null);
    } catch (error) {
        throw error;
    }
});

const tagLoader = new Dataloader(async (tagIDs) => {

    console.log("tagIDs", tagIDs);
    try {
        // tagLoader.clearAll();
        const tags = await Tag.find({ _id: { $in: tagIDs } }).exec();
        const tagsMap = new Map(tags.map((tag) => [tag._id.toString(), tag]));
        return tagIDs.map((id) => tagsMap.get(id.toString()) || null);
    } catch (error) {
        throw error;
    }
});


const projectLoader = new Dataloader((projectIDs) => {
    console.log("projectIDs", projectIDs);
    return Project.find({ _id: { $in: projectIDs } });
});

const userLoader = new Dataloader((userID) => {
    return User.find({ _id: { $in: userID } });
});



const getDocument = async (documentID) => {
    try {
        const document = await documentLoader.load(documentID._id.toString());

        if (!document) {
            return;

        }
        const tags = [];
        if (document.tags.length > 0) {
            for (const tagID of document.tags) {
                const tag = await getTag(tagID._id);
                tags.push(tag);
            }
        }

        return {
            ...document._doc,
            created_at: dataToString(document._doc.created_at),
            updated_at: dataToString(document._doc.updated_at),
            _id: document._id,
            project: getProject.bind(this, document.project),
            tags: tags,
            user: getUser.bind(this, document.user),
        };
    } catch (error) {
        throw error;
    }
};

const getProject = async (projectID) => {
    try {
        console.log("projectID22222", projectID);

        const project = await projectLoader.load(projectID.toString());
        if (!project) {
            throw new Error(`Project with ID ${projectID} not found`);
        }
        console.log("projectID333333", project);

        const documents = await Promise.all(
            project.documents?.map((documentID) => getDocument(documentID))
        );
        return {
            ...project._doc,
            _id: project._id,
            created_at: dataToString(project._doc.created_at),
            documents: documents,
            user: getUser.bind(this, project.user),

        };
    } catch (error) {
        throw error;
    }
};


const getUser = async (userID) => {

    try {
        const user = await userLoader.load(userID.toString());
        // console.log("user", user);

        if (!user) {
            throw new Error(`Project with ID ${userID} not found`);
        }
        const documents = await Promise.all(
            user.documents?.map((documentID) => getDocument(documentID))
        );
        const projects = await Promise.all(
            user.projects?.map((projectID) => getProject(projectID))
        );
        const tags = await Promise.all(
            user.tags?.map((tagID) => getTag(tagID))
        );

        return {
            ...user._doc,
            _id: user._id,
            password: null,
            created_at: dataToString(user._doc.created_at),
            documents: documents,
            project: projects,
            tags:tags
        };
    } catch (error) {
        throw error;
    }
};

const getTag = async (tagID) => {
    try {
        const tag = await tagLoader.load(tagID._id.toString());


        if (!tag) {
            return;
        }
        return {
            ...tag._doc,
            _id: tag._id,
            user: getUser.bind(this, tag.user),

        };
    } catch (error) {
        throw error;
    }
};

const checkUserID = (doc, userID) => {
    console.log("doc.user", doc.user);
    console.log("userID", userID);
    try {
        
        // console.log("doc.user", doc);
        if (doc.user.toString() !== userID) {
            //TODO: throw error
            console.log("???")
            return 
        } else {
            console.log("OK!!!")
            return 
        }
    } catch {
        return
    }
};


exports.getDocument = getDocument;
exports.getProject = getProject;
exports.getTag = getTag;
exports.getUser = getUser;
exports.documentLoader = documentLoader;
exports.projectLoader = projectLoader;
exports.tagLoader = tagLoader;
exports.userLoader = userLoader;
exports.checkUserID = checkUserID;
