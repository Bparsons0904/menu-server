"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthEmployee = exports.isUser = exports.isMessageOwner = exports.isAdmin = exports.isAuthenticated = void 0;
const apollo_server_1 = require("apollo-server");
const graphql_resolvers_1 = require("graphql-resolvers");
const isAuthenticated = (_parent, _args, { me }) => me ? graphql_resolvers_1.skip : new apollo_server_1.ForbiddenError("Not authenticated as user.");
exports.isAuthenticated = isAuthenticated;
exports.isAdmin = graphql_resolvers_1.combineResolvers(exports.isAuthenticated, (_parent, _args, { me: { role } }) => role === "ADMIN" ? graphql_resolvers_1.skip : new apollo_server_1.ForbiddenError("Not authorized as admin."));
const isMessageOwner = (_parent, { id }, { models, me }) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield models.Message.findByPk(id, { raw: true });
    if (message.userId !== me.id) {
        throw new apollo_server_1.ForbiddenError("Not authenticated as owner.");
    }
    return graphql_resolvers_1.skip;
});
exports.isMessageOwner = isMessageOwner;
const isUser = (_parent, { id }, { models, me }) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield models.User.findByPk(id, { raw: true });
    if (user.id !== me.id) {
        throw new apollo_server_1.ForbiddenError("Not authenticated as user.");
    }
    return graphql_resolvers_1.skip;
});
exports.isUser = isUser;
const isAuthEmployee = (_parent, { id }, { models, me }) => __awaiter(void 0, void 0, void 0, function* () {
    const employer = yield models.Employer.findByPk(id, { raw: true });
    if (employer.owner !== me.id) {
        throw new apollo_server_1.ForbiddenError("Not authenticated as user.");
    }
    return graphql_resolvers_1.skip;
});
exports.isAuthEmployee = isAuthEmployee;
//# sourceMappingURL=authorization.js.map