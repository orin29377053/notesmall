const { buildSchema } = require("graphql");

module.exports = buildSchema(`

  type Article  {
    _id: ID! 
    title: String! 
    body: String! 
    createdAt: String! 
  }
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
    documents: [Document]
    user: User
  }

  type Tag  @cacheControl(maxAge: 1 scope: PUBLIC inheritMaxAge: true) {
    _id: ID! 
    name: String! 
    colorCode: String  
    created_at: String! 
    document: [Document] 
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

  type User {
    _id: ID!
    name: String
    email: String!
    password: String
    role: UserRoles!
    documents: [Document!]
    projects: [Project!]
    searchHistory: [String!]
    created_at: String!
    token:String

  }
  



  input TagInput {
    _id: ID
    name: String!
    colorCode: String
    document: [ID]
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
    articles:[Article!]
    documents(isDeleted:Boolean):[Document!] 
    document(id: ID!): Document
    searchDocuments(keyword: String!): [Document!]
    tag(id:ID!): Tag
    tags:[Tag!]
    projects:[Project!]
    project(id:ID!): Project
    me: User

  }

  type Mutation {
    createArticle(article:ArticleInput): Article
    createDocument(document:DocumentInput): Document
    updatedDocument(document:DocumentInput): Document
    deleteDocument(document:DocumentInput): Document
    createTag(tag:TagInput): Tag
    updatedTag(tag:TagInput): Tag
    createProject(project:ProjectInput): Project
    deleteTag(id:ID!): Tag
    permantDeleteALLDocument(document:DocumentInput): [Document!]
    permantDeleteDocument(id:ID!): Document
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
