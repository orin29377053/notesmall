require("dotenv").config();
const secret = process.env.SECRET;
const expireTime = 3600;
const saltRounds = process.env.SALT;
const guest = process.env.GUESTID;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../models/user");
const dataToString = require("../../utils/dataToString");
const { getTag, getProject, getDocument } = require("./merge");
const {
    InternalServerError,
    UserSignUpError,
    UserSignInError,
} = require("../errorHandler");
const logger = require("../../utils/logger");

const createToken = (id, email, secret, expireTime) => {
    return jwt.sign({ id, email }, secret, { expiresIn: expireTime });
};

const emailFormatValidation = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    const isValidEmail = emailRegex.test(email);
    if (!isValidEmail) {
        return false;
    }
    return true;
};

const passwordFormatValidation = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,12}$/;
    const isValidPassword = passwordRegex.test(password);
    if (!isValidPassword) {
        return false;
    }
    return true;
};

const transformUser = (user) => {
    return {
        ...user._doc,
        id: user._id,
        password: null,
        created_at: dataToString(user.created_at),
        token: createToken(
            user._id,
            user.email,
            secret,
            user.role !== "guest" ? expireTime : "365d"
        ),
        documents: user.documents?.map((documentID) =>
            getDocument(documentID, 1)
        ),
        projects: user.projects?.map((projectID) => getProject(projectID)),
        tags: user.tags?.map((tagID) => getTag(tagID, 1)),
    };
};

module.exports = {
    Query: {
        me: async (_, __, { isAuth, userID }, info) => {
            info.cacheControl.setCacheHint({ maxAge: 3, scope: "PUBLIC" });

            try {
                if (!isAuth) {
                    const me = await User.findById(guest);

                    logger.info("Get user information", `Guest user`);

                    return transformUser(me);
                }
                const me = await User.findById(userID);

                logger.info("Get user information", `User ${me.email}`);

                return transformUser(me);
            } catch (error) {
                return new InternalServerError(
                    error,
                    "Get user information failed"
                );
            }
        },
    },

    Mutation: {
        signup: async (_, { email, password }) => {
            try {
                const user = await User.findOne({ email });

                if (user) {
                    return new UserSignUpError(
                        `Email ${email} already exists`,
                        "Your Email already exists, please try another one"
                    );
                }

                const isValidEmail = emailFormatValidation(email);
                if (!isValidEmail) {
                    return new UserSignUpError(
                        `Email ${email} format is not correct`,
                        "Your Email format is not correct, please try another one"
                    );
                }

                const isValidPassword = passwordFormatValidation(password);
                if (!isValidPassword) {
                    return new UserSignUpError(
                        `Password  format is not correct`,
                        "Your Password format is not correct, please try another one"
                    );
                }

                const hash = await bcrypt.hash(password, +saltRounds);
                const newUser = await new User({
                    email,
                    password: hash,
                }).save();

                logger.info("Sign up", `User ${newUser.email} signed up`);

                return transformUser(newUser);
            } catch (error) {
                return new InternalServerError(error, "Sign up failed");
            }
        },
        signin: async (_, { email, password }) => {
            try {
                const user = await User.findOne({ email });
                if (!user) {
                    return new UserSignInError(
                        `Email ${email} not exists`,
                        "Your Email not exists, please try another one"
                    );
                }

                const valid = await bcrypt.compare(password, user.password);
                if (!valid) {
                    return new UserSignInError(
                        `Password not correct`,
                        "Your Password is not correct, please try again"
                    );
                }

                logger.info("Sign in", `User ${user.email} signed in`);
                return transformUser(user);
            } catch (error) {
                return new InternalServerError(error, "Sign in failed");
            }
        },
    },
};
