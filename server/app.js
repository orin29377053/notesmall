const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const http = require("http");
require("dotenv").config();
const { marked } = require("marked");
const app = express();

// aws
const fs = require("fs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
});

// apollo server
const { ApolloServer } = require("@apollo/server");
const {
    ApolloServerPluginCacheControl,
} = require("@apollo/server/plugin/cacheControl");

const { expressMiddleware } = require("@apollo/server/express4");
const {
    ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const Keyv = require("keyv");
const { KeyvAdapter } = require("@apollo/utils.keyvadapter");

const graphqlSchema = require("./graphql/schema");
const rootResolver = require("./graphql/resolvers/index");
const httpServer = http.createServer(app);
const {
    ApolloServerPluginLandingPageLocalDefault,
} = require("apollo-server-core");
const responseCachePlugin = require("@apollo/server-plugin-response-cache");
const server = new ApolloServer({
    typeDefs: graphqlSchema,
    resolvers: rootResolver,
    cache: new KeyvAdapter(new Keyv("redis://default@127.0.0.1:6379")),
    plugins: [
        ApolloServerPluginLandingPageLocalDefault({ embed: true }),
        ApolloServerPluginCacheControl({ defaultMaxAge: 1}),
        ApolloServerPluginDrainHttpServer({ httpServer }),
        responseCachePlugin.default(),
    ],
    // debug: true,
    csrfPrevention: true,
    introspection: true,

    // cacheControl: true
});
// mongoose
const mongoose = require("mongoose");
const url = process.env.MONGOATLAS_URL;
mongoose
    .connect(url)
    .then((res) => console.log("connect success"))
    .catch((error) => {
        throw error;
    });

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
    res.json({ data: "Hello World!" });
});

app.get("/marked", (req, res) => {
    const mdfile = fs.readFileSync("test.md", "utf8");
    const htmlContent = marked(mdfile);
    res.json({ data: htmlContent });
});

app.post("/marked", (req, res) => {
    const mdfile = req.body.data;
    console.log(req.body.data);
    fs.writeFile("test.md", mdfile, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error saving file");
        } else {
            console.log(`File test.md saved successfully`);
            res.send("OK");
        }
    });
});

app.get("/imageupload", async (req, res) => {
    const image = fs.readFileSync("1678240546826-480282.jpeg");

    const input = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: "1678240546826-480282.jpeg",
    };
    const command = new PutObjectCommand(input);

    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    const result = await fetch(url, {
        method: "PUT",
        body: image,
        headers: { "content-type": "image/jpeg" },
    });
    const objectUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${input.Key}`;

    res.json({ objectUrl: objectUrl });
});

app.get("/markdownupload", async (req, res) => {
    const mdfile = fs.readFileSync("test.md", "utf8");

    console.log(mdfile);
    const input = {
        Body: mdfile,
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: "test.md",
    };
    const command = new PutObjectCommand(input);

    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    const result = await fetch(url, {
        method: "PUT",
        body: mdfile,
        headers: { "content-type": "text/plain" },
    });
    console.log(result);
    const objectUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${input.Key}`;
    res.json({ objectUrl: objectUrl });
});

app.get("/getImagePresignedUrl", async (req, res) => {
    const fileName = req.query.fileName;

    const input = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
    };
    const command = new PutObjectCommand(input);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    res.json({
        presignedUrl: url,
        objectUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${input.Key}`,
    });
});
const graph = async () => {
    await server.start();
    app.use("/graphql", cors(), bodyParser.json(), expressMiddleware(server));
};
graph();

httpServer.listen(process.env.PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}/`);
});
// app.listen(process.env.PORT, () => {
//     console.log("Server started on port 8000");
// });
