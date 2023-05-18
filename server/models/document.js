const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const documentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        // required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isArchived: {
        type: Boolean,
        default: false,
        required: true,
    },
    isFavorite: {
        type: Boolean,
        default: false,
        required: true,
    },
    created_at: {
        type: Date,
        immutable: true, //不能被覆寫
        default: () => Date.now(),
    },
    updated_at: {
        type: Date,
        default: () => Date.now(),
    },
    tags: [
        {
            type: Schema.Types.ObjectId,
            ref: "Tag",
        },
    ],
    images: [
        {
            url: {
                type: String,
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            created_at: {
                type: Date,
                immutable: true, //不能被覆寫
                default: () => Date.now(),
            },
            autoTags: [
                {
                    type: String,
                },
            ],
        },
    ],

    project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
    },
});



module.exports = mongoose.model("Document", documentSchema);
