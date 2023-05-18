const Document = require("../../models/document");
const Project = require("../../models/project");
const User = require("../../models/user");
const dataToString = require("../../utils/dataToString");
const { getDocument, getUser } = require("./merge");
const { documentLoader, projectLoader, clearCache } = require("../dataloader");
const {
    InternalServerError,
    ProjectNotFoundError,
    NotAuthError,
} = require("../errorHandler");
const logger = require("../../utils/logger");

const transformProject = async (project) => {
    return {
        ...project._doc,
        _id: project.id,
        created_at: dataToString(project._doc.created_at),
        updated_at: dataToString(project._doc.updated_at),
        documents:
            project.documents?.length > 0
                ? await Promise.all(project.documents.map(getDocument))
                : [],
        user: getUser.bind(this, project.user),
    };
};

module.exports = {
    Query: {
        projects: async (_, args, { userID }) => {
            try {
                const projects = await Project.find()
                    .where("user")
                    .equals(userID);

                logger.info(
                    "Fetching projects",
                    `User ID ${userID} fetched projects`
                );
                return projects.map((project) => transformProject(project));
            } catch (error) {
                return new InternalServerError(
                    error,
                    "Fetching projects error"
                );
            }
        },
    },
    Mutation: {
        createProject: async (_, args, { userID }) => {
            try {
                const { name } = args.project;
                const project = new Project({
                    name,
                    user: userID,
                });

                // add project to user
                const newProject = await project.save();

                await User.findByIdAndUpdate(userID, {
                    $push: { projects: project._id },
                });

                await projectLoader.load(newProject._id);

                logger.info(
                    "Creating project",
                    `User ID ${userID} created project ${newProject._id}`
                );

                return { ...newProject._doc, _id: newProject.id };
            } catch (error) {
                return new InternalServerError(error, "Creating project error");
            }
        },
        updateProject: async (_, args, { userID }) => {
            try {
                const { _id, name } = args.project;
                const updated_at = Date.now();

                let waitForUpdateProject;

                // check if the project exists
                try {
                    waitForUpdateProject =
                        (await Project.findById(_id)) ||
                        (await projectLoader.load(_id));
                } catch (error) {
                    return new ProjectNotFoundError(
                        _id,
                        error,
                        `Project with ID ${_id} not found`
                    );
                }

                // check if user is authorized to update the project

                const user = waitForUpdateProject.user.toString();

                if (user !== userID) {
                    return new NotAuthError(
                        userID,
                        `You do not have permission to  update this project `,
                        "project",
                        _id.toString()
                    );
                }

                const project = await Project.findByIdAndUpdate(
                    {
                        _id,
                        user: userID,
                    },
                    {
                        name,
                        updated_at,
                    },
                    { new: true }
                );

                clearCache(_id, projectLoader);

                logger.info(
                    "Updating project",
                    `User ID ${userID} updated project ${_id}`
                );

                return transformProject(project);
            } catch (error) {
                return new InternalServerError(error, "Updating project error");
            }
        },
        deleteProject: async (_, { id }, { userID }) => {
            try {
                let waitForDeleteProject;

                // check if the project exists
                try {
                    waitForDeleteProject =
                        (await Project.findById(id)) ||
                        (await projectLoader.load(id));
                } catch (error) {
                    return new ProjectNotFoundError(
                        id,
                        error,
                        `Project with ID ${id} not found`
                    );
                }

                // check if user is authorized to delete the project

                const user = waitForDeleteProject.user.toString();

                if (user !== userID) {
                    return new NotAuthError(
                        userID,
                        `You do not have permission to  delete this project `,
                        "project",
                        id.toString()
                    );
                }

                const deleteProject = await Project.findOneAndDelete({
                    _id: id,
                    user: userID, 
                });

                // Remove project reference from associated documents

                await Document.updateMany(
                    { project: id },
                    { $unset: { project: "" } }
                );

                //delete project from user
                const updateUser = await User.findById(userID);
                updateUser.projects = updateUser.projects.filter(
                    (projectID) => projectID != id
                );
                await updateUser.save();

                clearCache(id, projectLoader);
                clearCache(deleteProject.documents, documentLoader);

                logger.info(
                    "Deleting project",
                    `User ID ${userID} deleted project ${id}`
                );

                return transformProject(deleteProject);
            } catch (error) {
                return new InternalServerError(error, "Deleting project error");
            }
        },
    },
};
