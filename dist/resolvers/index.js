"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_iso_date_1 = require("graphql-iso-date");
const user_1 = __importDefault(require("./user"));
const profile_1 = __importDefault(require("./profile"));
const customScalarResolver = {
    Date: graphql_iso_date_1.GraphQLDateTime,
};
exports.default = [
    customScalarResolver,
    user_1.default,
    profile_1.default,
];
//# sourceMappingURL=index.js.map