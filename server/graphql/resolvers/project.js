const Document = require("../../models/document");
const Tag = require("../../models/tag");
const Project = require("../../models/project");
const User = require("../../models/user");
const { documentFuzzySearch } = require("../search");
const dataToString = require("../../utils/dataToString");
const { getDocument, getProject, getTag,getUser,checkUserID } = require("./merge");
const {projectLoader}=require("./merge");

const transformProject = async (project) => {
    // console.log("project",project.documents);

    return {
        ...project._doc,
        _id: project.id,
        created_at: dataToString(project._doc.created_at),
        updated_at: dataToString(project._doc.updated_at),
        documents:
            project.documents?.length > 0
                ? await Promise.all(project.documents.map(getDocument))
                : null,
        user: getUser.bind(this, project.user),
    };
};

module.exports = {
    Query: {
        projects: async (parent,args, { isAuth, userID }) => {
            try {
                const projects = userID?await Project.find().where("user")
                .equals(userID):await Project.find();
                // console.log("projects", projects);
                const transformedProjects = await Promise.all(
                    projects.map(async (project) => {
                        return transformProject(project);
                    })
                );
                return transformedProjects;
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
                return transformProject(project);
            } catch (error) {
                throw error;
            }
        },
    },
    Mutation: {
        createProject: async (_, args,{ isAuth, userID }) => {
            // console.log(args);
            try {
                const { name, description } = args.project;
                const project = new Project({
                    name,
                    description,
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
                throw error;
            }
        },
        updateProject: async (_, args,{ isAuth, userID }) => {
            try {
                const { _id, name, isArchived, isFavorite, documents ,user} =
                    args.project;
                const updated_at = Date.now();

                const oldProject = await Project.findById(_id);

                checkUserID(oldProject,userID);


                const project = await Project.findByIdAndUpdate(
                    _id,
                    {
                        _id,
                        name,
                        isArchived,
                        isFavorite,
                        documents,
                        updated_at,
                        user
                    },
                    { new: true }
                );
                const newProject = await project.save();
                projectLoader.clear(newProject._id);

                if (documents) {
                    console.log("dwdw");
                    const oldDocuments = oldProject.documents;
                    const newDocuments = documents;
                    const deletedDocuments = oldDocuments.filter(
                        (document) => !newDocuments.includes(document)
                    );
                    const addedDocuments = newDocuments.filter(
                        (document) => !oldDocuments.includes(document)
                    );
                    deletedDocuments.forEach(async (documentID) => {
                        const document = await Document.findById(documentID);
                        document.project = null;
                        await document.save();
                    });
                    addedDocuments.forEach(async (documentID) => {
                        const document = await Document.findById(documentID);
                        document.project = _id;
                        await document.save();
                    });
                }
                // add project to user
                const userInfo = await User.findById(user);
                userInfo.projects = userInfo.projects.filter(
                    (projectID) => projectID != _id
                );
                userInfo.projects.push(_id);
                await userInfo.save();




                return transformProject(newProject);
            } catch (error) {
                throw error;
            }
        },
        deleteProject: async (_, args,{ isAuth, userID }) => {
            try {
                const { id } = args;
                // console.log(_id, isDeleted);
                const oldProject = await Project.findById(id);
                checkUserID(oldProject,userID);


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
                const user = await User.findById(project.user);
                user.projects = user.projects.filter(
                    (projectID) => projectID != id
                );
                await user.save();





                projectLoader.clear(id);

                return transformProject(project);
            } catch (error) {
                throw error;
            }
        },
    },
};
