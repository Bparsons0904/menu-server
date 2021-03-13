"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const graphql_resolvers_1 = require("graphql-resolvers");
const authorization_1 = require("./authorization");
const sequelize_1 = __importDefault(require("sequelize"));
const subscription_1 = __importStar(require("../subscription"));
const toCursorHash = (string) => Buffer.from(string).toString("base64");
const fromCursorHash = (string) => Buffer.from(string, "base64").toString("ascii");
exports.default = {
    Query: {
        messages: (_parent, { cursor, limit = 100 }, { models }) => __awaiter(void 0, void 0, void 0, function* () {
            const cursorOptions = cursor
                ? {
                    where: {
                        createdAt: {
                            [sequelize_1.default.Op.lt]: fromCursorHash(cursor),
                        },
                    },
                }
                : {};
            const messages = yield models.Message.findAll(Object.assign({ order: [["createdAt", "DESC"]], limit: limit + 1 }, cursorOptions));
            const hasNextPage = messages.length > limit;
            const edges = hasNextPage ? messages.slice(0, -1) : messages;
            return {
                edges,
                pageInfo: {
                    hasNextPage,
                    endCursor: toCursorHash(edges[edges.length - 1].createdAt.toString()),
                },
            };
        }),
        message: (_parent, { id }, { models }) => __awaiter(void 0, void 0, void 0, function* () {
            return yield models.Message.findByPk(id);
        }),
    },
    Mutation: {
        createMessage: graphql_resolvers_1.combineResolvers(authorization_1.isAuthenticated, (_parent, { text }, { models, me }) => __awaiter(void 0, void 0, void 0, function* () {
            const message = yield models.Message.create({
                text,
                userId: me.id,
            });
            subscription_1.default.publish(subscription_1.EVENTS.MESSAGE.CREATED, {
                messageCreated: { message },
            });
            return message;
        })),
        deleteMessage: graphql_resolvers_1.combineResolvers(authorization_1.isAuthenticated, authorization_1.isMessageOwner, (_parent, { id }, { models }) => __awaiter(void 0, void 0, void 0, function* () {
            return yield models.Message.destroy({ where: { id } });
        })),
        updateMessage: graphql_resolvers_1.combineResolvers(authorization_1.isAuthenticated, authorization_1.isMessageOwner, (_parent, { id, text }, { models }) => __awaiter(void 0, void 0, void 0, function* () {
            return yield models.Message.update({ text: text }, { where: { id: id }, returning: true }).then((message) => {
                return message[1][0].dataValues;
            });
        })),
    },
    Message: {
        user: (message, _args, { models }) => __awaiter(void 0, void 0, void 0, function* () {
            return yield models.User.findByPk(message.userId);
        }),
    },
    Subscription: {
        messageCreated: {
            subscribe: () => subscription_1.default.asyncIterator(subscription_1.EVENTS.MESSAGE.CREATED),
        },
    },
};
//# sourceMappingURL=message.js.map