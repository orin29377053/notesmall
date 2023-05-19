# Notesmall

Welcome to Notesmall ! You can try to use this online note editing service with test account below:
**Test account**
> Email:    test@gmail.com
> Password: test

[Try it !](https://notesmall.site/home)

## Description
Notesmall is a very friendly and easy-to-use cloud note editing service that mainly supports **Markdown syntax**, making it convenient for users to write notes. 
This service not only supports automatic saving, but also allows users to upload images through **drag and drop**, and provides cloud image compression services, so that your notes are not affected by image size and load super fast! 
In addition, Notesmall also has powerful search functionality, which not only supports **keyword autocomplete** during search, but also supports **bilingual search** in Chinese and English, as well as **image recognition search**, allowing you to easily capture every idea and image and review them easily in the future.

## Feature
### Note Editing
Notesmall supports **Markdown syntax, autosaving, drag-and-drop image uploading**, and note management , among other features. These features significantly enhance user productivity and make note editing more convenient and user-friendly.

### Note Search
Notesmall offers multiple search functionalities, including **keyword autocomplete, fuzzy search, bilingual search, and image recognition search**, among others. Users can effortlessly find the desired notes and quickly locate relevant content.

### Note Management
Notesmall provides various note management features, including **tagging** and **project management**. 

1. **Tags** : Users can employ tags to manage note status, importance, related keywords, and more. 
2. **Project Manager** :  Suitable for specific task and learning topic organization. These features assist users in organizing and managing notes effectively, thereby improving work efficiency and learning effectiveness.



## Technique

### Structure

1. **Frontend** : React, React-Redux, Redux-Saga
2. **Backend** 

    | Category   | Technology/Service                           |
    |------------|---------------------------------------------|
    | API        | GraphQL                                     |
    | Cache      | Redis, DataLoader                           |
    | Server     | Express (Node.js), Apollo Server (GraphQL)  |
    | Database   | MongoDB Atlas                               |
    | AWS service| S3 bucket, Route 53, CloudFront, EC2, ALB, Lambda |
    | Deploy     | Github Actions                              |

3. **Third party API** : Google Vision, Google Translate

<img src="https://orinlin.s3.amazonaws.com/notesmall+system+design.png"/>

### Solve problems
1. **Latency Reduction**
    1. In many offline and online note-taking software, as the number of notes increases or the size of images grows, it leads to longer loading times, resulting in a poor user experience and decreased usability. 
    2. Here, I optimize the front-end and back-end system architecture to minimize the number of requests and waiting time. Additionally, automatic image compression is implemented to reduce transmission time. Finally, a CDN caching mechanism is utilized to optimize the physical distance limitation for downloading web pages and static files like images.

2. **Great Editing Experience**
    1. As new note-taking software emerges, the primary task when trying out a new note-taking application is to familiarize oneself with its usage. 
    2. To enable users to quickly get started, I employ Markdown syntax as the core way of writing notes.

3. **Enhanced Search Functionality** 
    1. Currently, most note-taking software only supports exact search, which can be frustrating when users forget, misspell words, or use different terms to describe the same concept, resulting in unsatisfactory search results. 
    2. I utilize MongoDB Atlas Search as the search engine, combined with Lucene's tokenizer, to parse documents and build indexes. This setup supports fuzzy search and autocomplete functionality, allowing users to create their own note search engine.

## Contact
* Linkedin: [linkedin.com/in/linchinshou](linkedin.com/in/linchinshou)
* Email : orin29377053@gmail.com 

