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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const graphql_resolvers_1 = require("graphql-resolvers");
const apollo_server_1 = require("apollo-server");
const authorization_1 = require("./authorization");
const createToken = (user, secret, expiresIn) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, email, username, role } = user;
    return yield jsonwebtoken_1.default.sign({ id, email, username, role }, secret, {
        expiresIn,
    });
});
exports.default = {
    Query: {
        getUsers: (_parent, _args, { models }) => __awaiter(void 0, void 0, void 0, function* () {
            const users = yield models.User.findAll({
                include: [
                    {
                        model: models.Profile,
                    },
                ],
            });
            return users;
        }),
        getUser: (_parent, { id }, { models }) => __awaiter(void 0, void 0, void 0, function* () {
            return yield models.User.findByPk(id);
        }),
        me: (_parent, _args, { models, me }) => __awaiter(void 0, void 0, void 0, function* () {
            if (!me) {
                return null;
            }
            return yield models.User.findByPk(me.id, {
                include: [
                    {
                        model: models.Profile,
                    },
                ],
            });
        }),
    },
    Mutation: {
        registerUser: (_parent, { username, email, password }, { models, secret }) => __awaiter(void 0, void 0, void 0, function* () {
            const newUser = yield models.User.create({
                username,
                email,
                password,
            });
            return {
                token: createToken(newUser, secret, "30 days"),
                user: newUser,
            };
        }),
        loginUser: (_parent, { login, password }, { models, secret }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield models.User.findByLogin(login);
            if (!user) {
                throw new apollo_server_1.UserInputError("No user found with this login credentials.");
            }
            const isValid = yield user.validatePassword(password);
            if (!isValid) {
                throw new apollo_server_1.AuthenticationError("Invalid password.");
            }
            console.log(user);
            return { user, token: createToken(user, secret, "30 days") };
        }),
        deleteUser: graphql_resolvers_1.combineResolvers(authorization_1.isUser || authorization_1.isAdmin, (_parent, { id }, { models }) => __awaiter(void 0, void 0, void 0, function* () {
            return yield models.User.destroy({
                where: { id },
            });
        })),
        updateUser: graphql_resolvers_1.combineResolvers(authorization_1.isUser || authorization_1.isAdmin, (_parent, args, { models }) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(args);
            let user = yield models.User.findByPk(args.id);
            user.username = args.username ? args.username : user.username;
            user.email = args.email ? args.email : user.email;
            yield user.update({
                username: user.username,
                email: user.email,
            });
            return yield models.User.findByPk(args.id);
        })),
    },
};
//# sourceMappingURL=user.js.map