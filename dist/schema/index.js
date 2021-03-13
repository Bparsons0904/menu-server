"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const user_1 = __importDefault(require("./user"));
const profile_1 = __importDefault(require("./profile"));
const linkSchema = apollo_server_express_1.gql `
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
exports.default = [
    linkSchema,
    user_1.default,
    profile_1.default,
];
//# sourceMappingURL=index.js.map