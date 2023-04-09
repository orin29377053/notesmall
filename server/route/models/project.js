const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    isFavorite: {
        type: Boolean,
        default: false,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
        required: true,
    },
    isArchived: {
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
    documents: [
        {
            type: Schema.Types.ObjectId,
            ref: "Document",
        },
    ],
});

module.exports = mongoose.model("Project", projectSchema);
