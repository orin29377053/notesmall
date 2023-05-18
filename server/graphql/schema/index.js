const { buildSchema } = require("graphql");

module.exports = buildSchema(`

  type Document @cacheControl(maxAge: 1 scope: PUBLIC inheritMaxAge: true) {
    _id: ID! 
    title: String! 
    content: String 
    isDeleted: Boolean! 
    isArchived: Boolean! 
    isFavorite: Boolean! 
    created_at: String!  
    updated_at: String! 
    tags: [Tag] 
    project: Project 
    highlights: [Highlight!]
    score: Float!
    images: [images]
    user: User
  }

  type Project @cacheControl(maxAge: 1 scope: PUBLIC inheritMaxAge: true) {
    _id: ID!
    name: String!
    isFavorite: Boolean!
    isDeleted: Boolean!
    isArchived: Boolean!
    created_at: String!
    updated_at: String!
    documents: [Document!]
    user: User
  }

  type Tag  @cacheControl(maxAge: 1 scope: PUBLIC inheritMaxAge: true) {
    _id: ID! 
    name: String! 
    colorCode: String  
    created_at: String! 
    document: [Document] 
    user: User
  }

  type SearchResult {
    _id: ID! 
    title: String! 
    content: String 
    highlights: [Highlight!]
    score: Float!
  }

  type images{
    _id: ID!
    url: String!
    name: String!
    created_at: String!
    autoTags: [String!]

  }


  type Highlight {
    path: String!
    score: Float!
    texts:[HighlightDetail!]
  }
  type HighlightDetail {
    value: String!
    type: String!
  }

  type User @cacheControl(maxAge: 10 scope: PUBLIC inheritMaxAge: true){
    _id: ID!
    name: String
    email: String!
    password: String
    role: UserRoles!
    documents: [Document!]
    projects: [Project!]
    searchHistory: [String!]
    created_at: String!
    tags: [Tag!]
    token:String

  }
  



  input TagInput {
    _id: ID
    name: String!
    colorCode: String
    document: [ID]
    user: ID
  }



  input DocumentInput {
    _id: ID
    title: String
    content: String
    isDeleted: Boolean
    isFavorite: Boolean
    isArchived: Boolean
    tags: [ID]
    project: ID
    user: ID
  }

  input ProjectInput {
    _id: ID
    name: String
    isFavorite: Boolean
    isDeleted: Boolean
    isArchived: Boolean
    documents: [ID]
    user: ID
  }


  type Query {
    document(id: ID!): Document
    searchDocuments(keyword: String!): [Document!]
    autoComplete(keyword: String!): [String!]
    tags:[Tag!]
    projects:[Project!]
    me: User 

  }

  type Mutation {
    createDocument(document:DocumentInput): Document
    updatedDocument(document:DocumentInput): Document
    updatedDocumentContent(id:ID! content:String!): Boolean
    deleteDocument(document:DocumentInput): Document
    createTag(tag:TagInput): Tag
    updatedTag(tag:TagInput): Tag
    createProject(project:ProjectInput): Project
    deleteTag(id:ID!): Tag
    permanentDeleteDocument(id:ID!): Document
    updateProject(project:ProjectInput): Project
    deleteProject(id:ID!): Project
    signup(email: String!, password: String!): User
    signin(email: String!, password: String!): User

  }

  schema {
    query: Query
    mutation: Mutation
  }
  enum CacheControlScope {
    PUBLIC
    PRIVATE
  }
  enum UserRoles {
    admin
    user
    guest
  }

  
  directive @cacheControl(
    maxAge: Int
    scope: CacheControlScope
    inheritMaxAge: Boolean
  ) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION
`);
