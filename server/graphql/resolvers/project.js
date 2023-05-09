const Document = require("../../models/document");
const Project = require("../../models/project");
const User = require("../../models/user");
const dataToString = require("../../utils/dataToString");
const { getDocument, getUser } = require("./merge");
const { projectLoader } = require("./merge");

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
        projects: async (parent, args, { userID }) => {
            try {
                const projects = await Project.find().where("user").equals(userID)
                const transformedProjects = await Promise.all(
                    projects.map(async (project) => {
                        return transformProject(project);
                    })
                );
                return transformedProjects;
            } catch (error) {
                return error;
            }
        },
        project: async (parent, { id }) => {
            try {
                const project = await Project.findById(id);
                if (!project) {
                    throw new Error(`Project with ID ${id} not found`);
                }
                return transformProject(project);
            } catch (error) {
                return error;
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

                await User.findByIdAndUpdate(userID, {
                    $push: { projects: project._id },
                });

                const newProject = await project.save();
                projectLoader.load(newProject._id);
                return { ...newProject._doc, _id: newProject.id };
            } catch (error) {
                return error;
            }
        },
        updateProject: async (_, args, { userID }) => {
            try {
                console.log(args,"args")
                const { _id, name} =
                    args.project;
                const updated_at = Date.now();

                const oldProject = await Project.findById(_id);

                const project = await Project.findByIdAndUpdate(
                    _id,
                    {
                        _id,
                        name,
                        // documents,
                        updated_at,
                        // user,
                    },
                    { new: true }
                );
                const newProject = await project.save();
                projectLoader.clear(newProject._id.toString());

                // if (documents) {
                //     console.log("documents",documents)
                //     const oldDocuments = oldProject.documents;
                //     const newDocuments = documents;
                //     const deletedDocuments = oldDocuments.filter(
                //         (document) => !newDocuments.includes(document)
                //     );
                //     const addedDocuments = newDocuments.filter(
                //         (document) => !oldDocuments.includes(document)
                //     );
                //     deletedDocuments.forEach(async (documentID) => {
                //         const document = await Document.findById(documentID);
                //         document.project = null;
                //         await document.save();
                //     });
                //     addedDocuments.forEach(async (documentID) => {
                //         const document = await Document.findById(documentID);
                //         document.project = _id;
                //         await document.save();
                //     });
                // }
                // add project to user
                const userInfo = await User.findById(userID);
                userInfo.projects = userInfo.projects.filter(
                    (projectID) => projectID != _id
                );
                userInfo.projects.push(_id);
                await userInfo.save();

                return transformProject(newProject);
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        deleteProject: async (_, args, { userID }) => {
            try {
                const { id } = args;

                const project = await Project.findByIdAndDelete(id);
                if (!project) {
                    throw new Error(`Project with ID ${id} not found`);
                }
                project.documents.forEach(async (documentID) => {
                    const document = await Document.findById(documentID);
                    document.project = null;
                    await document.save();
                });

                //delete project from user
                const user = await User.findById(userID);
                user.projects = user.projects.filter(
                    (projectID) => projectID != id
                );
                await user.save();

                projectLoader.clear(id);

                return transformProject(project);
            } catch (error) {
                return error;
            }
        },
    },
};
