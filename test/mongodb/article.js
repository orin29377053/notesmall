const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const artcleSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    body: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        immutable: true, //不能被覆寫
        default: () => Date.now(),
    },
});

module.exports = mongoose.model("Article", artcleSchema);
