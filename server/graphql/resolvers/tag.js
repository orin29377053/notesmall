const Document = require("../../models/document");
const Tag = require("../../models/tag");
const Project = require("../../models/project");
const dataToString = require("../../utils/dataToString");
const { getDocument, getProject } = require("./merge");
const {tagLoader}=require("./merge")

const transformTag = async (tag) => {
    return {
        ...tag._doc,
        _id: tag.id,
        created_at: dataToString(tag._doc.created_at),
        document:
            tag.document?.length > 0
                ? await Promise.all(tag.document.map(getDocument))
                : [],
    };
};

module.exports = {
    Query: {
        tag: async (parent, { id }, context, info) => {
            // console.log(parent, context, info);
            try {
                const tag = await Tag.findById(id);
                if (!tag) {
                    throw new Error(`Tag with ID ${id} not found`);
                }
                return transformTag(tag);
            } catch (error) {
                throw error;
            }
        },
        tags: async (parent, args, context, info) => {
            // console.log("parent", parent);
            try {
                const tags = await Tag.find();
                // console.log("tags", tags);
                return tags.map(async (tag) => {
                    return transformTag(tag);
                });
            } catch (error) {
                throw error;
            }
        },
    },
    Mutation: {
        createTag: async (_, args) => {
            try {
                const { name, colorCode } = args.tag;
                const tag = new Tag({
                    name,
                    colorCode,
                });
                const newTag = await tag.save();
                tagLoader.load(newTag._id);

                return transformTag(newTag);
            } catch (error) {
                throw error;
            }
        },
        updatedTag: async (_, args) => {
            try {
                const { _id, name, colorCode, document } = args.tag;
                const tag = await Tag.findByIdAndUpdate(
                    _id,
                    { name, colorCode, document },
                    { new: true }
                );
                if (!tag) {
                    throw new Error(`Tag with ID ${id} not found`);
                }
                tagLoader.clear(_id);
                return transformTag(tag);
            } catch (error) {
                throw error;
            }
        },
        deleteTag: async (_, args) => {
            try {
                const { id } = args;
                const tag = await Tag.findByIdAndDelete(id);
                // console.log(tag);

                if (!tag) {
                    throw new Error(`Tag with ID ${id} not found`);
                }
                //pull from document
                await Document.updateMany(
                    { _id: { $in: tag.document } },
                    { $pull: { tags: id } }
                );
                tagLoader.clear(id);


                return transformTag(tag);
            } catch (error) {
                throw error;
            }
        },
    },
};
