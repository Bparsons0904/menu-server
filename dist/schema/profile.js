"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
exports.default = apollo_server_express_1.gql `
  extend type Query {
    getUserProfile(userId: ID!): Profile
    getUserProfiles(active: Boolean): [Profile!]
    getProfile(id: ID!): CompleteProfile
  }

  extend type Mutation {
    createProfile(
      userId: String!
      firstName: String
      lastName: String
      role: String

      userId: ID
    ): Profile!

    updateProfile(
      id: ID!
      firstName: String
      lastName: String
      role: String

      userId: ID
    ): Profile
  }

  type Profile {
    id: ID
    firstName: String
    lastName: String
    role: String

    userId: ID
  }

  type CompleteProfile {
    user: User
    profile: Profile
  }
`;
//# sourceMappingURL=profile.js.map