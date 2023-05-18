const { GraphQLError } = require("graphql");
const  logger  = require("../../utils/logger");

class BaseError extends GraphQLError {
    constructor(rawError, logMessage, message, extensions) {
        super(
            message,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            extensions
        );
        this.errorName = this.constructor.name; // 儲存子類別的名稱
        logger.error(this.errorName, rawError.stack || rawError, logMessage);
    }
}



class UserSignInError extends BaseError {
    constructor( logMessage, message) {
        super("Sign in failed", logMessage, message, { code: 401 });
    }
}

class UserSignUpError extends BaseError {
    constructor( logMessage, message) {
        super("Sign up failed", logMessage, message, { code: 400 });
    }
}


class InternalServerError extends BaseError {
    constructor(rawError, logMessage) {
        super(rawError, logMessage, "Internal Server Error", { code: 500 });
    }
}

class NotFoundError extends BaseError {
    constructor(id, rawError, logMessage) {
        super(rawError, logMessage, `ID ${id} is not found`, { code: 404 });
    }
}

class DocumentNotFoundError extends NotFoundError {
    constructor(id, rawError, logMessage) {
        super(id, rawError, logMessage);
        this.message = `Document ${this.message}`;
    }
}

class ProjectNotFoundError extends NotFoundError {
    constructor(id, rawError, logMessage) {
        super(id, rawError, logMessage);
        this.message = `Project ${this.message}`;
    }
}

class TagNotFoundError extends NotFoundError {
    constructor(id, rawError, logMessage) {
        super(id, rawError, logMessage);
        this.message = `Tag ${this.message}`;
    }
}



class NotAuthError extends BaseError {
    constructor(UserID, message, collection, documentID) {
        super(
            "Auth Failed",
            `User ${UserID} is not authorized to access ${collection} ${documentID}`,
            message,
            {
                code: 403,
            }
        );
    }
}

class DetectImageError extends BaseError {
    constructor(rawError, logMessage) {
        super(rawError, logMessage, "Detect Image Error", { code: 500 });
    }
}



module.exports = {
    InternalServerError,
    NotFoundError,
    DocumentNotFoundError,
    NotAuthError,
    DetectImageError,
    UserSignInError,
    UserSignUpError,
    ProjectNotFoundError,
    TagNotFoundError,
    BaseError

};


