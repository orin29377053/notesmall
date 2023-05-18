const Dataloader = require("dataloader");
const {
    tagLoader,
    documentLoader,
    projectLoader,
    userLoader,
    clearCache,
} = require("./index");
const Tag = require("../../models/tag");
const Document = require("../../models/document");
const Project = require("../../models/project");
const User = require("../../models/user");

jest.mock("../../models/tag", () => ({
    find: jest.fn(),
}));

jest.mock("../../models/document", () => ({
    find: jest.fn(),
}));
jest.mock("../../models/project", () => ({
    find: jest.fn(),
}));

jest.mock("../../models/user", () => ({
    find: jest.fn(),
}));

const projects = [
    { _id: "1", name: "Project 1" },
    { _id: "2", name: "Project 2" },
];

const users = [
    { _id: "1", name: "User 1" },
    { _id: "2", name: "User 2" },
];
const tags = [
    { _id: "1", name: "Tag 1" },
    { _id: "2", name: "Tag 2" },
];

const documents = [
    { _id: "1", name: "Document 1" },
    { _id: "2", name: "Document 2" },
];

describe("tagLoader", () => {
    afterEach(() => {
        Tag.find.mockReset();
    });

    test("should load a tag correctly", async () => {
        const findMock = Tag.find.mockReturnValue({
            exec: jest.fn().mockResolvedValue(tags),
        });
        const result = await tagLoader.load("1");

        expect(result).toEqual({ _id: "1", name: "Tag 1" });

        expect(findMock).toHaveBeenCalledTimes(1);
    });

    test("should return null", async () => {
        const findMock = Tag.find.mockReturnValue({
            exec: jest.fn().mockResolvedValue(tags),
        });
        const result = await tagLoader.load("3");

        expect(result).toEqual(null);

        expect(findMock).toHaveBeenCalledTimes(1);
    });
});

describe("documentLoader", () => {
    afterEach(() => {
        Document.find.mockReset();
    });

    test("should load a document correctly", async () => {
        const findMock = Document.find.mockReturnValue({
            exec: jest.fn().mockResolvedValue(documents),
        });
        const result = await documentLoader.load("1");

        expect(result).toEqual({ _id: "1", name: "Document 1" });

        expect(findMock).toHaveBeenCalledTimes(1);
    });

    test("should return null", async () => {
        const findMock = Document.find.mockReturnValue({
            exec: jest.fn().mockResolvedValue(documents),
        });
        const result = await documentLoader.load("3");

        expect(result).toEqual(null);

        expect(findMock).toHaveBeenCalledTimes(1);
    });
});

describe("projectLoader", () => {
    afterEach(() => {
        Project.find.mockReset();
    });

    test("should load projects correctly", async () => {
        const findMock = Project.find.mockResolvedValue(projects);

        const result = await projectLoader.loadMany(["1", "2"]);

        expect(result).toEqual(projects);

        expect(findMock).toHaveBeenCalledWith({ _id: { $in: ["1", "2"] } });
    });
});

describe("userLoader", () => {
    afterEach(() => {
        User.find.mockReset();
    });

    test("should load users correctly", async () => {
        const findMock = User.find.mockReturnValue({
            exec: jest.fn().mockResolvedValue(users),
        });
        const result = await userLoader.load("1");


        expect(result).toEqual({ _id: "1", name: "User 1" });

        expect(findMock).toHaveBeenCalledWith({ _id: { $in: ["1"] } });
    });
});

describe("clearCache", () => {
    test("should clear cache for a single key", () => {
        const dataloader = {
            clear: jest.fn(),
        };

        clearCache("key1", dataloader);

        expect(dataloader.clear).toHaveBeenCalledWith("key1");
    });

    test("should clear cache for multiple keys", () => {
        const dataloader = {
            clear: jest.fn(),
        };

        clearCache(["key1", "key2"], dataloader);

        expect(dataloader.clear).toHaveBeenCalledWith("key1,key2");

    });

    test("should do nothing if keys parameter is not provided", () => {
        const dataloader = {
            clear: jest.fn(),
        };

        clearCache(undefined, dataloader);

        expect(dataloader.clear).not.toHaveBeenCalled();
    });
});
