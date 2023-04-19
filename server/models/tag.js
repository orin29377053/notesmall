const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tagSchema = new Schema({

    name: {
        type: String,
        required: true,
    },
    colorCode: {
        type: String,
        // required: true,
    },

    created_at: {
        type: Date,
        immutable: true, //不能被覆寫
        default: () => Date.now(),
    },
    document: [
        {
            type: Schema.Types.ObjectId,
            ref: "Document",
        },
    ]
});
tagSchema.pre("find", function (next) {
    console.log("Tag search started");
    next();
});

module.exports = mongoose.model("Tag", tagSchema);
