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

module.exports = mongoose.model("Tag", tagSchema);
