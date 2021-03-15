import express, { Request } from "express";
// Token generation
import jwt from "jsonwebtoken";
// Import required modules for Apollo/GraphQL
import { ApolloServer, AuthenticationError } from "apollo-server-express";
import schema from "./schema";
import resolvers from "./resolvers";
import models, { sequelize } from "./models";
// Allow for cross-domain request
import cors from "cors";
// Allow transfer of data over HTTP
import http from "http";
import DataLoader from "dataloader";
import loaders from "./loaders";
// import { createDeflateRaw } from "zlib";

// set app variable to express main function
const app = express();

// Allow cross domain request
app.use(cors());

// Set current user
const getMe = async (req: Request) => {
  // token from header
  const token: string = <string>req.headers["x-token"] ?? "";
  // If token is found
  if (token) {
    // Verify token matches secret token
    const secret: string =
      process.env.SECRET ??
      "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTYxNTYxMDcwOSwiaWF0IjoxNjE1NjEwNzA5fQ.vpub-pTfzR5bKyWzVhKsFZFV2T3jOE9c9Gcfr8OYCJU";
    try {
      return await jwt.verify(token, secret);
    } catch (e) {
      throw new AuthenticationError("Your session expired. Sign in again.");
    }
  }

  return;
};

// Init apollo server with schema and resolvers
const server = new ApolloServer({
  introspection: true,
  playground: true,
  typeDefs: schema,
  resolvers,
  formatError: (error) => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace("SequelizeValidationError: ", "")
      .replace("Validation error: ", "");

    return {
      ...error,
      message,
    };
  },
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        models,
        loaders: {
          user: new DataLoader((keys) => loaders.user.batchUsers(keys, models)),
        },
      };
    }

    if (req) {
      const me = await getMe(req);

      return {
        models,
        me,
        secret:
          process.env.SECRET ??
          "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTYxNTYxMDcwOSwiaWF0IjoxNjE1NjEwNzA5fQ.vpub-pTfzR5bKyWzVhKsFZFV2T3jOE9c9Gcfr8OYCJU",
        loaders: {
          user: new DataLoader((keys) => loaders.user.batchUsers(keys, models)),
        },
      };
    }
    return;
  },
});

// Set API path and include express as middleware
server.applyMiddleware({ app, path: "/graphql" });

// Init http server to handle subscriptions
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

// Check if using testing database
const resetDB = process.env.RESETDB == "true" ? true : false;
// Check if production database in use
const isProduction = !!process.env.DATABASE_URL;
// Port based on prod or dev environment
const port = process.env.PORT || 8000;

// Connect to postgres database through sequelize
sequelize
  .sync({ force: resetDB && !isProduction, logging: isProduction })
  .then(async () => {
    // sequelize.sync({ force: isTest }).then(async () => {
    if (resetDB) {
      createDefaultData();
    }

    // Listen on port based on prod or dev
    httpServer.listen({ port }, () => {
      console.log(`Apollo Server on http://localhost:${port}/graphql`);
    });
  });

// For development, clean database, complete necessary table/column updates, add
// data for each model

async function createDefaultData() {
  const admin = await models.User.create({
    username: "Admin",
    email: "admin@menu.com",
    password: "menu",
  });

  const user = await models.User.create({
    username: "User",
    email: "user@menu.com",
    password: "menu",
  });

  await models.Profile.create({
    firstName: "John",
    lastName: "Doe",
    role: "admin",
    userId: admin.id,
  });

  await models.Profile.create({
    firstName: "Jane",
    lastName: "Doe",
    role: "user",
    userId: user.id,
  });
}
