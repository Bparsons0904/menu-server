"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
exports.default = apollo_server_express_1.gql `
  extend type Query {
    getUser(id: ID!): User
    getUsers: [User!]
    me: User
  }

  extend type Mutation {
    registerUser(username: String, email: String!, password: String!): NewUser!

    loginUser(login: String!, password: String!): NewUser

    updateUser(id: ID!, username: String, email: String): User!

    deleteUser(id: ID!): Boolean!
  }

  type Token {
    token: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    profile: Profile
  }

  type NewUser {
    user: User
    token: String!
  }
`;
//# sourceMappingURL=user.js.map