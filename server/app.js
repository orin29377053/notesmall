const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const http = require("http");
require("dotenv").config();

const app = express();

// apollo server
const { ApolloServer } = require("@apollo/server");
const {
    ApolloServerPluginCacheControl,
} = require("@apollo/server/plugin/cacheControl");
const { expressMiddleware } = require("@apollo/server/express4");
const {
    ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const { KeyvAdapter } = require("@apollo/utils.keyvadapter");
const graphqlSchema = require("./graphql/schema");
const rootResolver = require("./graphql/resolvers/index");
const httpServer = http.createServer(app);
const {
    ApolloServerPluginLandingPageLocalDefault,
} = require("apollo-server-core");
const responseCachePlugin = require("@apollo/server-plugin-response-cache");

// utils
const { cache } = require("./utils/cache");
const { tokenVerify } = require("./utils/tokenVerify");

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
    csrfPrevention: true,
    introspection: true,
    includeStacktraceInErrorResponses: false,
});

// mongoose
const mongoose = require("mongoose");
mongoose
    .connect(process.env.MONGOATLAS_URL)
    .then(() => console.log("connect success"))
    .catch((error) => {
        throw error;
    });

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");

app.use(
    cors({
        origin: allowedOrigins,
    })
);

// route
app.use("/api/1.0", [require("./route/image_route")]);

// health check

app.get("/", async (req, res) => {
    res.json({ data: "Hello World!" });
});

// error handling

app.use(async (err, req, res, next) => {
    console.error(err);
    res.status(500).send("Internal Server Error");
});

const graph = async () => {
    await server.start();
    app.use(
        "/graphql",
        bodyParser.json(),
        expressMiddleware(server, {
            context: async ({ req }) => {
                try {
                    const token = req.headers.token;
                    if (!token) {
                        throw new Error("No token");
                    }
                    const user = await tokenVerify(token, process.env.SECRET);
                    return { isAuth: true, userID: user.id };
                } catch (e) {
                    return { isAuth: false, userID: process.env.GUESTID };
                }
            },
        })
    );
};
graph();

httpServer.listen(process.env.PORT, async () => {
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}/`);
});
