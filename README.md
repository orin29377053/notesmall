
<div align="center">
<img src="image/mylogo.png"/>
</div>

<div align="center">

![GraphQL](https://img.shields.io/badge/-GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) ![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)  ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![Markdown](https://img.shields.io/badge/markdown-%23000000.svg?style=for-the-badge&logo=markdown&logoColor=white) ![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white) ![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white) ![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)  ![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white) 

</div>




# Welcome to Notesmall !

<!-- You can try to use this cloud note editing service with test account below: -->

<!-- **Test account**
> Email:    test@gmail.com
>
> Password: test -->

<!-- [Try it !](https://notesmall.site/home) -->

## Table of Contents

* [Description](#description)
* [Feature](#feature)
    * [Editing](#editing)
    * [Search](#search)
    * [Management](#management)
    * [Compare](#compare)
* [How to use](#how-to-use)
    * [Sign in](#sign-in)
    * [Add new document](#add-new-document)
    * [Image upload](#image-upload)
    * [Search](#search-1)
    * [Project management](#project-management)
    * [Tag management](#tag-management)
* [Technique](#technique)
    * [System Architecture](#system-architecture)
    * [Schema](#schema)
    * [Technologies](#technologies)
        * [Frontend](#frontend)
        * [GraphQL](#graphql)
        * [Authorization](#authorization)
        * [Image handling](#image-handling)
        * [Search](#search-2)
        * [Error handling](#error-handling)
        * [Logger](#logger)
* [Road map](#road-map)
* [Contact](#contact)



## Description
Notesmall is a user-friendly and easy-to-use cloud note editing service that primarily supports **Markdown syntax**. It provides a convenient platform for writing notes and offers **powerful search functionality**, enabling you to effortlessly capture and review every idea and image. 
>Experience the efficiency and convenience of Notesmall, empowering you to unleash your creativity and productivity effortlessly !

## Feature
### Editing

* **Markdown syntax** : Easy to formate text and create structured content
* **Autosaving** : Automatically save changes 
* **Drag-and-drop image uploading** : Easily upload images by dropping them into the editor.

### Search
* **Keyword autocomplete** : Prompt the user with the content of the note
* **Fuzzy search** : Prevent typos and provide similar search results
* **Bilingual search** : Providing English and Chinese bilingual search
* **Image recognition search** : Image automatic tagging, enabling  keyword-based image search

### Management

*  **Tags** : Users can employ tags to manage note status, importance, related keywords, and more. 
* **Project Manager** :  Suitable for specific task and learning topic organization. 

### Compare
| Feature              | My Service                 | Other Note-Taking Software     |
|----------------------|----------------------------|--------------------------------|
| **Latency** | Optimized requests , image compression, CDN caching | Slower loading times as the number of notes and images increase |
| **Editor** | Markdown syntax | Varies across different software |
| **Full-text Search** | Fuzzy search, Autocomplete, Bilingual search | Limited search capabilities, typically supporting only exact search |
| **Image Search** | Image recognition and automatic tagging |May not have specific image search functionality |


## How to use

### Sign in

<img src="image/login.gif"/>

### Add new document

<img src="image/new.gif"/>

### Mange document

<img src="image/detail.gif"/>

### Image upload
<img src="image/cat.gif"/>

### Search 

<img src="image/searchcat.gif"/>

### Project management

<img src="image/project.gif"/>

### Tag management

<img src="image/tag.gif"/>


## Technique

### System Architecture



<img src="image/structure.png"/>

1. **Frontend** : React, React-Redux, Redux-Saga
2. **Backend** 

    | Category   | Technology/Service                           |
    |------------|---------------------------------------------|
    | API        | [GraphQL](#graphql)                                     |
    | Cache      | Redis, DataLoader                           |
    | Server     | Express (Node.js), Apollo Server (GraphQL)  |
    | Database   | MongoDB Atlas                               |
    | AWS service| S3 bucket, Route 53, CloudFront, EC2, ALB, Lambda |
    | Deploy     | Github Actions                              |

3. **Third party API** : Google Vision, Google Translate


### Schema

<img src="image/schema3.png"/>


### Technologies

#### Frontend
1. **React** : The frontend pages are implemented using the `React` framework and managed global variables through `React Redux`, enabling real-time updates of user information without sending requests to the backend.

<img src="image/reducer.png"/>

2. **API management** :`Redux Saga` is utilized for frontend API management, providing control over request flow and allowing for handling of response actions, such as redirecting upon successful requests or customizing notification messages.

<img src="image/redux.png"/>

3. **Deploy** : The frontend pages are automatically built and deployed to an S3 bucket using `GitHub Actions`, and leverages `AWS CloudFront`  for CDN caching to minimize page load time for users.


#### GraphQL
1. **GraphQL** provides more flexibility in frontend function development. The main resolvers include `user`, `document`, `project`, and `tag`, which are interconnected with each other in the schema. Furthermore, each resolver has its own dataloader responsible for caching and batch querying.

<img src="image/graphql.png"/>

2. **Dataloader** is a solution to the common n+1 problem in GraphQL.  In the context of this system's resolvers, nested queries may impose a query load on the database, so dataloader is used as a tool for batching and caching. Moreover, when data is updated, the dataloader is cleared to reduce the query load on the backend server to the database.

<img src="image/dataloader.png"/>

> **N+1 problem** : if there are n data items that need to be queried, a list of these n data items must first be obtained, followed by a query for each data item.

3. **Depth control**: In MongoDB, if two tables have a reference relationship and are in a **many-to-many** situation, nested queries in GraphQL may cause infinite loops, leading to server crash. At this point, depth control is needed to restrict the maximum query depth of the resolver to prevent server crashes.

```js
const getDocument = async (documentID, depth = 2) => {
    // Default query depth is 2
    try {
        const document = await documentLoader.load(documentID._id.toString());

        if (!document) {
            return;
        }

        const tags =
            depth > 0
                ? await Promise.all(
                      document.tags?.map((tagID) => getTag(tagID, depth - 1))   
                      // Everytime nested query , depth -= 1
                  )
                : document.tags;

        return {
            ...document._doc,
            created_at: dataToString(document._doc.created_at),
            updated_at: dataToString(document._doc.updated_at),
            _id: document._id,
            project: getProject.bind(this, document.project),
            tags: tags,
            user: getUser.bind(this, document.user),
        };
    } catch (error) {
        console.error("Error loading document:", error);
        return error;
    }
};

//......

```
#### Authorization
1. **JWT verify** : Utlized JWT (JSON Web Token) for user authentication. Whenever a user sends any request from the browser, the request will carry a JWT in headers by default, then  verifies the JWT in the `middleware`.
2. If the decoding is successful, a `userID` is added to the `context` of the [GraphQL](#graphql) request.
3. If fails ( eg: `expired`, `undefined`, or `null` ), subsequent requests are processed as `guest` .
4. When accessing data in the server, it further verify the permission to access the data. If this verification fails, an error message is returned to the browser to prevent users from illegally modifying others' data.

<img src="image/jwt.png"/>

#### Image handling
1. Users can upload images to the notes by dragging and dropping.
2. The browser obtains a presigned URL from the server and uses it to upload the image to S3.
3. Upon successful image upload, S3 triggers a Lambda function to compress the image, which is then transferred to another S3 bucket.
4. Due to the cold start buffering time required when Lambda is triggered, there might be a delay in compressing the image.
5. Meanwhile, the browser continuously polling to the S3 bucket which storing the resized image, to confirm its existence.
6. If the resized image exists, the browser inserts the URL of the resized image into the document and loads the image.
7. Due to the addition of the URL of the newly uploaded image, document content changed, it sends an auto-save request to the server.
8. Upon detecting an image URL in the content, the server fetch the image recognition API and uploads the recognized tags to the database.
9. From uploading the image to image recognition , the process is asynchronous, enabling users to continue editing without having to wait for .
<img src="image/imagehandling.png"/>

#### Search
1. **Auto-complete** : As a user types in the search field, each change triggers a request to the server for auto-completion of keywords. The server executes an auto-complete query on the database and returns potential keywords that might appear in the text.
2. **Full-text search** : Upon completion of input and pressing Enter, a full-text search is initiated. After the search results are returned, the browser highlights the relevant keywords.

<img src="image/search.png"/>

#### Error handling
1. When sending requests to [GraphQL](#graphql), the response is primarily 200, regardless of whether the request succeeds or fails.
2. To prevent misjudgment on the frontend, using the extension module `GraphQLError`, as the error handling method. It allows customization of the status code and error message.
3. To make the module more versatile, creating a `baseError` that inherits of `GraphQLError`, which has custom error message structure and integrated a [logger](#logger) module to log when an error is thrown.
4. Extended more custom error such as `UserError` and `NotFoundError`, facilitating developers in managing and tracking errors.
<img src="image/errorhandling.png"/>

#### Logger
1. Develop logger as Class.
```js
class Logging {
    constructor() {}

    info(eventName, logMessage) {
        console.info(eventLogFormatter(eventName, logMessage));
    }
    error(ErrorName, rawError, logMessage) {
        console.error(errorLogFormatter(ErrorName, rawError, logMessage));
    }
}
```
2. Easy to manage and extremely flexible in terms of functional extension. If other log management services such as `ELK` need to be introduced in the future, it can reduce development costs.
2. There are two types of logs: `info` and `error`, `info` mainly records user operation situations, while `error` records error messages thrown by the system. The formats of both are as follows:


```js
//error
function errorLogFormatter(ErrorName, rawError, logMessage) {
    return `Error - ${new Date().toISOString()} - ${ErrorName} - ${rawError} - ${logMessage}`;
}

// info
function eventLogFormatter(EventName, logMessage) {
    return `Event - ${new Date().toISOString()} - ${EventName} - ${logMessage}`;
}

```

## Road map
* DataLoader moved to Redis
* Optmize the GraphQL query from frontend
* Docouments archieved and import / export




## Contact
* Linkedin: [linkedin.com/in/linchinshou](https://www.linkedin.com/in/linchinshou/)
* Email : orin29377053@gmail.com 

