const Document = require("../../route/models/document");
const Tag = require("../../route/models/tag");
const Project = require("../../route/models/project");
const { documentFuzzySearch } = require("../search");
const dataToString = require("../../utils/dataToString");
const { getDocument, getProject, getTag } = require("./merge");
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
    };
};

module.exports = {
    Query: {
        projects: async () => {
            try {
                const projects = await Project.find().populate("documents");
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
        createProject: async (_, args) => {
            // console.log(args);
            try {
                const { name, description } = args.project;
                const project = new Project({
                    name,
                    description,
                });
                const newProject = await project.save();
                projectLoader.load(newProject._id);
                return { ...newProject._doc, _id: newProject.id };
            } catch (error) {
                throw error;
            }
        },
        updateProject: async (_, args) => {
            try {
                const { _id, name, isArchived, isFavorite, documents } =
                    args.project;
                const updated_at = Date.now();

                const project = await Project.findByIdAndUpdate(
                    _id,
                    {
                        _id,
                        name,
                        isArchived,
                        isFavorite,
                        documents,
                        updated_at,
                    },
                    { new: true }
                );
                const newProject = await project.save();
                projectLoader.clear(newProject._id);

                if (documents) {
                    console.log("dwdw");
                    const oldProject = await Project.findById(_id);
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
                return transformProject(newProject);
            } catch (error) {
                throw error;
            }
        },
        deleteProject: async (_, args) => {
            try {
                const { id } = args;
                // console.log(_id, isDeleted);
                const project = await Project.findByIdAndDelete(id);
                if (!project) {
                    throw new Error(`Project with ID ${id} not found`);
                }
                project.documents.forEach(async (documentID) => {
                    const document = await Document.findById(documentID);
                    document.project = null;
                    await document.save();
                });
                projectLoader.clear(id);

                return transformProject(project);
            } catch (error) {
                throw error;
            }
        },
    },
};
