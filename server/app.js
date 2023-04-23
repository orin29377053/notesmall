const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const http = require("http");
require("dotenv").config();
const app = express();
const jwt = require("jsonwebtoken");

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
const { cache } = require("./utils/cache");
const server = new ApolloServer({
    typeDefs: graphqlSchema,
    resolvers: rootResolver,
    cache: new KeyvAdapter(cache),
    plugins: [
        ApolloServerPluginLandingPageLocalDefault({ embed: true }),
        ApolloServerPluginCacheControl({ defaultMaxAge: 1 }),
        ApolloServerPluginDrainHttpServer({ httpServer }),
        responseCachePlugin.default(),
    ],
    // debug: true,
    csrfPrevention: true,
    introspection: true,
    // includeStacktraceInErrorResponses: false,
});
// mongoose
const mongoose = require("mongoose");
const { application } = require("express");
const url = process.env.MONGOATLAS_URL;
mongoose
    .connect(url)
    .then((res) => console.log("connect success"))
    .catch((error) => {
        throw error;
    });

// cloud vision
const vision = require("@google-cloud/vision");
const credentials = JSON.parse(process.env.GOOGLE_API_JSON);
const client = new vision.ImageAnnotatorClient({
    credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
    },
});

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/api/1.0", [require("./route/image_route")]);

app.get("/", (req, res) => {
    res.json({ data: "Hello World!" });
});

async function imageDetection(client, url) {
    const [result] = await client.labelDetection({
        image: {
            source: {
                imageUri: url,
            },
        },
    });
    console.log(result);
    return result;
}

app.get("/cloudvision", async (req, res) => {
    const dcd = await imageDetection(
        client,
        "https://orinlin.s3.amazonaws.com/%E6%88%AA%E5%9C%96+2023-04-19+%E4%B8%8A%E5%8D%8811.37.03.png"
    );
    // console.log(process.env.GOOGLE_API_JSON)

    // detections.forEach((text) => console.log(text));
    res.json({ data: dcd });
});

app.use(function (err, req, res, next) {
    console.log(err);
    res.status(500).send("Internal Server Error");
});

function tokenVerify(token, secret) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, function (err, decoded) {
            if (err) {
                reject(err);
            } else if (decoded) {
                resolve(decoded);
            }
        });
    });
}

const graph = async () => {
    await server.start();
    app.use(
        "/graphql",
        cors(),
        bodyParser.json(),
        expressMiddleware(server, {
            context: async({ req }) => {
                const token = req.headers.token;
                // console.log(token);
                if (!token) {
                    return { isAuth: false,userID:process.env.GUESTID };
                }
                try {
                    
                    const user = await tokenVerify(token, process.env.SECRET);
                    return { isAuth: true ,userID:user.id};
                } catch(e) {
                    console.log(e);
                    //TODO:error handling
                    return { isAuth: false,userID:process.env.GUESTID };

                    // throw new Error("Authentication failed!");
                }
            },
        })
    );
};
graph();

httpServer.listen(process.env.PORT, async () => {
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}/`);
});
// app.listen(process.env.PORT, () => {
//     console.log("Server started on port 8000");
// });
