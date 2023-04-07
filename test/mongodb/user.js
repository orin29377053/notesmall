const mongoose = require("mongoose");
// const url='mongodb+srv://orin:a29377053@notesmall.f1tat52.mongodb.net/test'
// mongoose.connect(url);

const userSchema = new mongoose.Schema({
    name: String,
    age: {
        type: Number,
        min: 1,
        max: 100,
        required: true,
        validate: {
            validator: (v) => v % 2 === 0,
            message: (props) => `${props.value} is not an even number`,
        },
    },
    createAt: {
        type: Date,
        immutable: true, //不能被覆寫
        default: () => Date.now(),
    },
    article:String
});

// const User=

module.exports=mongoose.model("User",userSchema) 