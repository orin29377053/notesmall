const secret = process.env.SECRET;
const expireTime = 10;
const saltRounds = process.env.SALT;
const guest = process.env.GUESTID;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../models/user");
const dataToString = require("../../utils/dataToString");
const { getTag, getProject, getUser, documentLoader,checkUserID,getDocument } = require("./merge");

const createToken = (id, email, secret, expireTime) => {
    return jwt.sign({ id, email }, secret, { expiresIn: expireTime });
};

const tarnsformUser = (user) => {
    return {
        ...user._doc,
        id: user._id,
        password: null,
        created_at: dataToString(user.created_at),
        token: createToken(user._id, user.email, secret, expireTime),
        documents: user.documents?.map((documentID) => getDocument(documentID)),
        projects: user.projects?.map((projectID) => getProject(projectID)),

    };
};

module.exports = {
    Query: {
        me: async (_, __, { isAuth, userID }) => {
            if (!isAuth) {
                const me = await User.findById(guest);
                return tarnsformUser(me);
            }
            const me = await User.findById(userID);
            return tarnsformUser(me);
        },
    },

    Mutation: {
        signup: async (_, { email, password }) => {
            console.log(email, password);
            const user = await User.findOne({ email });
            if (user) {
                throw new Error("Email already exists");
            }
            const hash = await bcrypt.hash(password, +saltRounds);
            const newUser = await new User({
                email,
                password: hash,
            }).save();
            console.log(newUser);
            return tarnsformUser(newUser);
        },
        signin: async (_, { email, password }) => {
            // console.log(token);

            const user = await User.findOne({ email });
            if (!user) {
                throw new Error("Email not exists");
            }
            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                throw new Error("Password is not correct");
            }
            return tarnsformUser(user);
        },
    },
};
