const dataToString = require("../../utils/dataToString");
const {
    documentLoader,
    tagLoader,
    projectLoader,
    userLoader,
} = require("../dataloader");

const getDocument = async (documentID, depth = 2) => {
    try {
        const document = await documentLoader.load(documentID._id.toString());

        if (!document) {
            return;
        }

        const tags =
            depth > 0
                ? await Promise.all(
                      document.tags?.map((tagID) => getTag(tagID, depth - 1))
                  )
                : document.tags;

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
        console.error("Error loading document:", error);
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

        if (!user) {
            throw new Error(`Project with ID ${userID} not found`);
        }

        const [documents, projects, tags] = await Promise.all([
            user.documents?.map((documentID) => getDocument(documentID)),
            user.projects?.map((projectID) => getProject(projectID)),
            user.tags?.map((tagID) => getTag(tagID)),
        ]);

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

exports.getDocument = getDocument;
exports.getProject = getProject;
exports.getTag = getTag;
exports.getUser = getUser;
