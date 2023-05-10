const Document = require("../../models/document");
const Tag = require("../../models/tag");
const Project = require("../../models/project");
const Dataloader = require("dataloader");
const dataToString = require("../../utils/dataToString");
const User = require("../../models/user");

const documentLoader = new Dataloader(async (documentIDs) => {
    try {

        const documents = await Document.find({
            _id: { $in: documentIDs },
        }).exec();
        const documentsMap = new Map(
            documents.map((doc) => [doc._id.toString(), doc])
        );
        return documentIDs.map((id) => documentsMap.get(id.toString()) || null);
    } catch (error) {
        return error;
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
        return error;
    }
});

const projectLoader = new Dataloader((projectIDs) => {
    console.log("projectIDs", projectIDs);
    return Project.find({ _id: { $in: projectIDs } });
});


const userLoader = new Dataloader((userID) => {
    return User.find({ _id: { $in: userID } });
});

const getDocument = async (documentID, depth = 2) => {
    try {
        // const usedMemoryBefore = process.memoryUsage().heapUsed;

        const document = await documentLoader.load(documentID._id.toString());
        // const usedMemoryAfter = process.memoryUsage().heapUsed;
        // const memoryConsumption = usedMemoryAfter - usedMemoryBefore;
        // console.log(`Memory consumption: ${memoryConsumption} bytes`);
        // console.log(`Memory total: ${usedMemoryAfter} bytes`);

        if (!document) {
            return;
        }
        // const tags = [];
        // if (document.tags.length > 0 && depth > 0) {
        //     for (const tagID of document.tags) {
        //         const tag = await getTag(tagID._id, depth - 1);
        //         tags.push(tag);
        //     }
        // }
        const tags =
            depth > 0
                ? await Promise.all(
                      document.tags?.map((tagID) => getTag(tagID, depth - 1))
                  )
                : document.tags;
        // console.log("tags", tags,"document.tags",document.tags);

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
        return error;
    }
};

const getProject = async (projectID) => {
    try {
        const project = await projectLoader.load(projectID.toString());
        if (!project) {
            throw new Error(`Project with ID ${projectID} not found`);
        }

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
        return error;
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
            tags: tags,
        };
    } catch (error) {
        return error;
    }
};

const getTag = async (tagID, depth = 2) => {
    try {
        const tag = await tagLoader.load(tagID._id.toString());

        if (!tag) {
            return;
        }
        const document =
            depth > 0
                ? await Promise.all(
                      tag.document?.map((documentID) =>
                          getDocument(documentID, depth - 1)
                      )
                  )
                : tag.document;
        return {
            ...tag._doc,
            _id: tag._id,
            user: getUser.bind(this, tag.user),
            document,
        };
    } catch (error) {
        return error;
    }
};

const checkUserID = (doc, userID) => {
    try {
        // console.log("doc.user", doc);
        if (doc.user.toString() !== userID) {
            //TODO: throw error
            return;
        } else {
            return;
        }
    } catch {
        return;
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
