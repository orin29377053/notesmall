const Document = require("../../route/models/document");
const Tag = require("../../route/models/tag");
const Project = require("../../route/models/project");
const { documentFuzzySearch } = require("../search");
const dataToString = require("../../utils/dataToString");
const { getDocument, getProject, getTag } = require("./merge");

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
    };
};

module.exports = {
    Query: {
        projects: async () => {
            try {
                const projects = await Project.find();
                return projects.map(async (project) => {
                    transformProject(project);
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
                return { ...newProject._doc, _id: newProject.id };
            } catch (error) {
                throw error;
            }
        },
    },
};
