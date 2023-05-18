
const documentResolver = require("./document")
const tagResolver = require("./tag")
const projectResolver = require("./project")
const userResolver = require("./user")




const rootResolver = {
    Query : {
        ...documentResolver.Query,
        ...tagResolver.Query,
        ...projectResolver.Query,
        ...userResolver.Query,

    },
    Mutation : {
        ...documentResolver.Mutation,
        ...tagResolver.Mutation,
        ...projectResolver.Mutation,
        ...userResolver.Mutation,

    }
}
module.exports =  rootResolver ;