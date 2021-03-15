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
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const apollo_server_express_1 = require("apollo-server-express");
const schema_1 = __importDefault(require("./schema"));
const resolvers_1 = __importDefault(require("./resolvers"));
const models_1 = __importStar(require("./models"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const dataloader_1 = __importDefault(require("dataloader"));
const loaders_1 = __importDefault(require("./loaders"));
const app = express_1.default();
app.use(cors_1.default());
const getMe = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const token = (_a = req.headers["x-token"]) !== null && _a !== void 0 ? _a : "";
    if (token) {
        const secret = (_b = process.env.SECRET) !== null && _b !== void 0 ? _b : "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTYxNTYxMDcwOSwiaWF0IjoxNjE1NjEwNzA5fQ.vpub-pTfzR5bKyWzVhKsFZFV2T3jOE9c9Gcfr8OYCJU";
        try {
            return yield jsonwebtoken_1.default.verify(token, secret);
        }
        catch (e) {
            throw new apollo_server_express_1.AuthenticationError("Your session expired. Sign in again.");
        }
    }
    return;
});
const server = new apollo_server_express_1.ApolloServer({
    introspection: true,
    playground: true,
    typeDefs: schema_1.default,
    resolvers: resolvers_1.default,
    formatError: (error) => {
        const message = error.message
            .replace("SequelizeValidationError: ", "")
            .replace("Validation error: ", "");
        return Object.assign(Object.assign({}, error), { message });
    },
    context: ({ req, connection }) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        if (connection) {
            return {
                models: models_1.default,
                loaders: {
                    user: new dataloader_1.default((keys) => loaders_1.default.user.batchUsers(keys, models_1.default)),
                },
            };
        }
        if (req) {
            const me = yield getMe(req);
            return {
                models: models_1.default,
                me,
                secret: (_c = process.env.SECRET) !== null && _c !== void 0 ? _c : "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTYxNTYxMDcwOSwiaWF0IjoxNjE1NjEwNzA5fQ.vpub-pTfzR5bKyWzVhKsFZFV2T3jOE9c9Gcfr8OYCJU",
                loaders: {
                    user: new dataloader_1.default((keys) => loaders_1.default.user.batchUsers(keys, models_1.default)),
                },
            };
        }
        return;
    }),
});
server.applyMiddleware({ app, path: "/graphql" });
const httpServer = http_1.default.createServer(app);
server.installSubscriptionHandlers(httpServer);
const resetDB = process.env.RESETDB == "true" ? true : false;
const isProduction = !!process.env.DATABASE_URL;
const port = process.env.PORT || 8000;
models_1.sequelize
    .sync({ force: resetDB && !isProduction, logging: isProduction })
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    if (resetDB) {
        createDefaultData();
    }
    httpServer.listen({ port }, () => {
        console.log(`Apollo Server on http://localhost:${port}/graphql`);
    });
}));
function createDefaultData() {
    return __awaiter(this, void 0, void 0, function* () {
        const admin = yield models_1.default.User.create({
            username: "Admin",
            email: "admin@menu.com",
            password: "menu",
        });
        const user = yield models_1.default.User.create({
            username: "User",
            email: "user@menu.com",
            password: "menu",
        });
        yield models_1.default.Profile.create({
            firstName: "John",
            lastName: "Doe",
            role: "admin",
            userId: admin.id,
        });
        yield models_1.default.Profile.create({
            firstName: "Jane",
            lastName: "Doe",
            role: "user",
            userId: user.id,
        });
    });
}
//# sourceMappingURL=index.js.map