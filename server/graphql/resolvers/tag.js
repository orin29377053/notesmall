const Document = require("../../models/document");
const Tag = require("../../models/tag");
const User = require("../../models/user");
const dataToString = require("../../utils/dataToString");
const { getDocument } = require("./merge");
const { getUser } = require("./merge");
const { documentLoader, tagLoader, clearCache } = require("../dataloader");
const {
    TagNotFoundError,
    NotAuthError,
    InternalServerError,
} = require("../errorHandler");
const logger = require("../../utils/logger");

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
        tags: async (_, args, { userID }) => {
            try {
                const tags = await Tag.find().where("user").equals(userID);

                logger.info("Fetching tags", `User ID ${userID} fetched tags`);
                return tags.map(async (tag) => {
                    return transformTag(tag);
                });
            } catch (error) {
                return new InternalServerError(error, "Fetching tags error");
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

                logger.info(
                    "Creating tag",
                    `User ID ${userID} created tag ${newTag._id}`
                );

                return transformTag(newTag);
            } catch (error) {
                return new InternalServerError(error, "Creating tag error");
            }
        },
        updatedTag: async (_, args, { userID }) => {
            try {
                const { _id, name, colorCode } = args.tag;

                let waitForUpdateTag;

                try {
                    waitForUpdateTag =
                        (await Tag.findById(_id)) ||
                        (await tagLoader.load(_id.toString()));
                } catch (error) {
                    return new TagNotFoundError(
                        _id,
                        error,
                        `Tag with ID ${_id} not found`
                    );
                }

                const user = waitForUpdateTag.user.toString();

                if (user !== userID) {
                    return new NotAuthError(
                        `You do not have permission to  update this Tag `,
                        "tag",
                        _id.toString()
                    );
                }

                const tag = await Tag.findOneAndUpdate(
                    { _id, user: userID },
                    { name, colorCode },
                    { new: true }
                );

                clearCache(_id, tagLoader);

                logger.info(
                    "Updating tag",
                    `User ID ${userID} updated tag ${_id}`
                );

                return transformTag(tag);
            } catch (error) {
                return new InternalServerError(error, "Updating tag error");
            }
        },
        deleteTag: async (_, { id }, { userID }) => {
            try {
                let waitForDeleteTag;

                try {
                    waitForDeleteTag =
                        (await Tag.findById(id)) ||
                        (await tagLoader.load(id.toString()));
                } catch (error) {
                    return new TagNotFoundError(
                        id,
                        error,
                        `Tag with ID ${id} not found`
                    );
                }

                const user = waitForDeleteTag.user.toString();
                const document = waitForDeleteTag.document;

                if (user !== userID) {
                    return new NotAuthError(
                        userID,
                        `You do not have permission to  delete this Tag `,
                        "tag",
                        id.toString()
                    );
                }

                //Delete Tag and pull from user and document

                const [tag] = await Promise.all([
                    Tag.findByIdAndDelete(id),
                    User.updateMany(
                        { _id: { $in: userID } },
                        { $pull: { tags: id } }
                    ),
                    Document.updateMany(
                        { _id: { $in: document } },
                        { $pull: { tags: id } }
                    ),
                ]);

                // clear cache

                clearCache(id, tagLoader);
                clearCache(document, documentLoader);

                logger.info(
                    "Deleting tag",
                    `User ID ${userID} deleted tag ${id}`
                );

                return transformTag(tag);
            } catch (error) {
                return new InternalServerError(error, "Deleting tag error");
            }
        },
    },
};
