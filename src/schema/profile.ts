import { gql } from "apollo-server-express";

// User schemas
export default gql`
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
