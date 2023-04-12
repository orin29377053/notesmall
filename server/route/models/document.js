const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const documentSchema = new Schema({
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
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
    },
});


documentSchema.pre("find", function (next) {
    console.log("Document search started");
    next();
});

module.exports = mongoose.model("Document", documentSchema);
