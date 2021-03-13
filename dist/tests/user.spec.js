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
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const userApi = __importStar(require("./api"));
describe("users", () => {
    describe("user(id: String!): User", () => {
        it("returns a user when user can be found", () => __awaiter(void 0, void 0, void 0, function* () {
            const expectedResult = {
                data: {
                    user: {
                        id: "1",
                        username: "rwieruch",
                        email: "hello@robin.com",
                        role: "ADMIN",
                    },
                },
            };
            const result = yield userApi.user({ id: "1" });
            chai_1.expect(result.data).to.eql(expectedResult);
        }));
        it("returns null when user cannot be found", () => __awaiter(void 0, void 0, void 0, function* () {
            const expectedResult = {
                data: {
                    user: null,
                },
            };
            const result = yield userApi.user({ id: "42" });
            chai_1.expect(result.data).to.eql(expectedResult);
        }));
    });
    describe("deleteUser(id: String!): Boolean!", () => {
        it("returns an error because only admins can delete a user", () => __awaiter(void 0, void 0, void 0, function* () {
            const { data: { data: { signIn: { token }, }, }, } = yield userApi.signIn({
                login: "ddavids",
                password: "ddavids",
            });
            const { data: { errors }, } = yield userApi.deleteUser({ id: "1" }, token);
            chai_1.expect(errors[0].message).to.eql("Not authorized as admin.");
        }));
    });
    describe("signUp(username: String!, email: String!, password: String!): Token", () => {
        it("returns a token for new user", () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield userApi.signUp({
                username: "111111fdsaskdjbf111",
                email: "1d111111eadgsdafsddstyle@gmail.com",
                password: "deadpass2020",
            });
            chai_1.expect(result.data).to.not.have.property("errors");
        }));
    });
});
//# sourceMappingURL=user.spec.js.map