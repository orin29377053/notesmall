const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
        required: true,
    },

    created_at: {
        type: Date,
        immutable: true, //不能被覆寫
        default: () => Date.now(),
    },
    documents: [
        {
            type: Schema.Types.ObjectId,
            ref: "Document",
        },
    ],
    projects: [
        {
            type: Schema.Types.ObjectId,
            ref: "Project",
        },
    ],
    searchHistory: [
        {
            type: String,
        },
    ],

});

module.exports = mongoose.model("User", userSchema);