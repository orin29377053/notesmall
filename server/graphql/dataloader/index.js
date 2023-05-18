const Dataloader = require("dataloader");
const Document = require("../../models/document");
const Tag = require("../../models/tag");
const Project = require("../../models/project");
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
    try {
        const tags = await Tag.find({ _id: { $in: tagIDs } }).exec();
        const tagsMap = new Map(tags.map((tag) => [tag._id.toString(), tag]));
        return tagIDs.map((id) => tagsMap.get(id.toString()) || null);
    } catch (error) {
        return error;
    }
});

const projectLoader = new Dataloader(async (projectIDs) => {
    const projects = await Project.find({ _id: { $in: projectIDs } });
    const projectMap = {};
    projects.forEach((project) => {
        projectMap[project._id.toString()] = project;
    });

    return projectIDs.map((projectID) => projectMap[projectID.toString()]);
});

const userLoader = new Dataloader(async (userIDs) => {
    const users = await User.find({ _id: { $in: userIDs } }).exec();
    const userMap = new Map(users.map((user) => [user._id.toString(), user]));
    return userIDs.map((userID) => userMap.get(userID.toString()) || null);
});

const clearCache = (keys, dataloader) => {
    if (!keys) return;

    if (typeof keys === "string" || typeof keys === "object") {
        keys = [keys];
    }
    keys.forEach((key) => {
        dataloader.clear(key.toString());
    });
};




module.exports = {
    documentLoader,
    tagLoader,
    projectLoader,
    userLoader,
    clearCache
};
