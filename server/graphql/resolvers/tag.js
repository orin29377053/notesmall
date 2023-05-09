const Document = require("../../models/document");
const Tag = require("../../models/tag");
const User = require("../../models/user");
const dataToString = require("../../utils/dataToString");
const { getDocument } = require("./merge");
const { tagLoader, getUser } = require("./merge");

const transformTag = async (tag) => {
    return {
        ...tag._doc,
        _id: tag.id,
        created_at: dataToString(tag._doc.created_at),
        document:
            tag.document?.length > 0
                ? await Promise.all(tag.document.map(getDocument))
                : [],
        user: tag.user ? getUser.bind(this, tag.user) : null,
    };
};

module.exports = {
    Query: {
        tag: async (parent, { id }) => {
            try {
                const tag = await Tag.findById(id);
                if (!tag) {
                    throw new Error(`Tag with ID ${id} not found`);
                }
                return transformTag(tag);
            } catch (error) {
                return error;
            }
        },
        tags: async (parent, args, { userID }) => {
            try {
                const tags = await Tag.find().where("user").equals(userID);
                return tags.map(async (tag) => {
                    return transformTag(tag);
                });
            } catch (error) {
                return error;
            }
        },
    },
    Mutation: {
        createTag: async (_, args, { userID }) => {
            try {
                const { name, colorCode } = args.tag;
                const tag = new Tag({
                    name,
                    colorCode,
                    user: userID,
                });
                const newTag = await tag.save();
                tagLoader.load(newTag._id);

                await User.findByIdAndUpdate(userID, {
                    $push: { tags: newTag._id },
                });

                return transformTag(newTag);
            } catch (error) {
                return error;
            }
        },
        updatedTag: async (_, args, { userID }) => {
            try {
                const { _id, name, colorCode, document } = args.tag;

                const tag = await Tag.findOneAndUpdate(
                    { _id, user: userID },
                    { name, colorCode, document },
                    { new: true, runValidators: true }
                );

                if (!tag) {
                    throw new Error(`Tag with ID ${_id} not found`);
                }
                tagLoader.clear(_id);
                return transformTag(tag);
            } catch (error) {
                return error;
            }
        },
        deleteTag: async (_, args) => {
            try {
                const { id } = args;
                const tag = await Tag.findByIdAndDelete(id);

                // user
                await User.updateMany(
                    { _id: { $in: tag.user } },
                    { $pull: { tags: id } }
                );

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
                return error;
            }
        },
    },
};
