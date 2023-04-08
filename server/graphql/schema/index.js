const { buildSchema } = require("graphql")

module.exports = buildSchema(`

  type Article {
    _id: ID!
    title: String!
    body: String!
    createdAt: String!
  }
  type Document {
    _id: ID!
    title: String!
    content: String
    isDeleted: Boolean!
    created_at: String!
    updated_at: String!
  }


  input ArticleInput {
    title: String!
    body: String!
  }

  input DocumentInput {
    _id: ID
    title: String
    content: String
    isDeleted: Boolean
  }

  type Query {
    articles:[Article!]
    documents:[Document!]
    document(id: ID!): Document

  }

  type Mutation {
    createArticle(article:ArticleInput): Article
    createDocument(document:DocumentInput): Document
    updatedDocument(document:DocumentInput): Document
    deleteDocument(document:DocumentInput): Document
  }

  schema {
    query: Query
    mutation: Mutation
  }
`)