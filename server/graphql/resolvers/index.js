// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.


const documentResolver = require("./document")
const tagResolver = require("./tag")
const projectResolver = require("./project")
const articleResolver = require("./article")




const rootResolver = {
    Query : {
        ...documentResolver.Query,
        ...tagResolver.Query,
        ...projectResolver.Query,
        ...articleResolver.Query
    },
    Mutation : {
        ...documentResolver.Mutation,
        ...tagResolver.Mutation,
        ...projectResolver.Mutation,
    }
}
// console.log("rootResolver", rootResolver);
module.exports =  rootResolver ;