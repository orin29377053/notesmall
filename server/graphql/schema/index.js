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
    tags: [Tag!]
    project: Project
  }

  type Project {
    _id: ID!
    name: String!
    isFavorite: Boolean!
    isDeleted: Boolean!
    isArchived: Boolean!
    created_at: String!
    updated_at: String!
    documents: [Document]
  }




  type Tag {
    _id: ID!
    name: String!
    colorCode: String
    created_at: String!
    document: [Document!]
  }
  input TagInput {
    _id: ID
    name: String!
    colorCode: String
    document: [ID!]
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
    tags: [ID!]
    project: ID
  }

  input ProjectInput {
    _id: ID
    name: String
    isFavorite: Boolean
    isDeleted: Boolean
    isArchived: Boolean
    document: [ID]
  }


  type Query {
    articles:[Article!]
    documents(isDeleted:Boolean!):[Document!]
    document(id: ID!): Document
    searchDocuments(keyword: String!): [Document!]
    tag(id:ID!): Tag
    tags:[Tag!]
    projects:[Project!]
    project(id:ID!): Project

  }

  type Mutation {
    createArticle(article:ArticleInput): Article
    createDocument(document:DocumentInput): Document
    updatedDocument(document:DocumentInput): Document
    deleteDocument(document:DocumentInput): Document
    createTag(tag:TagInput): Tag
    updatedTag(tag:TagInput): Tag
    createProject(project:ProjectInput): Project
  }

  schema {
    query: Query
    mutation: Mutation
  }
`)