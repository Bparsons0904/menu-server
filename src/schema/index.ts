import { gql } from "apollo-server-express";
import { GraphQLJSONObject } from "graphql-type-json";

// Import User and Message schemas
import userSchema from "./user";
// import messageSchema from "./message";
import profileSchema from "./profile";

// Link available Schemas
const linkSchema = gql`
  scalar Date
  scalar JSON
  scalar JSONObject

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

export default [
  linkSchema,
  userSchema,
  // messageSchema,
  profileSchema,
];
