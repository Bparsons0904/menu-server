import { gql } from "apollo-server-express";

// User schemas
export default gql`
  extend type Query {
    getUser(id: ID!): User
    getUsers: [User!]
    me: User
    test: Boolean
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
