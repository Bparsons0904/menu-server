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
exports.message = exports.deleteUser = exports.signUp = exports.signIn = exports.user = void 0;
const axios_1 = __importDefault(require("axios"));
const API_URL = "http://localhost:8000/graphql";
const user = (variables) => __awaiter(void 0, void 0, void 0, function* () {
    return axios_1.default.post(API_URL, {
        query: `
      query ($id: ID!) {
        user(id: $id) {
          id
          username
          email
          role
        }
      }
    `,
        variables,
    });
});
exports.user = user;
const signIn = (variables) => __awaiter(void 0, void 0, void 0, function* () {
    return yield axios_1.default.post(API_URL, {
        query: `
      mutation ($login: String!, $password: String!) {
        signIn(login: $login, password: $password) {
          token
        }
      }
    `,
        variables,
    });
});
exports.signIn = signIn;
const signUp = (variables) => __awaiter(void 0, void 0, void 0, function* () {
    return yield axios_1.default.post(API_URL, {
        query: `
      mutation ($username: String!, $email: String!, $password: String!) {
        signUp(username: $username, email: $email, password: $password) {
          token
        }
      }
    `,
        variables,
    });
});
exports.signUp = signUp;
const deleteUser = (variables, token) => __awaiter(void 0, void 0, void 0, function* () {
    return axios_1.default.post(API_URL, {
        query: `
        mutation ($id: ID!) {
          deleteUser(id: $id)
        }
      `,
        variables,
    }, {
        headers: {
            "x-token": token,
        },
    });
});
exports.deleteUser = deleteUser;
const message = (variables) => __awaiter(void 0, void 0, void 0, function* () {
    return axios_1.default.post(API_URL, {
        query: `
      query ($id: ID!) {
        message(id: $id) {
          text
          user {
            username
            email
          }
        }
      }
    `,
        variables,
    });
});
exports.message = message;
//# sourceMappingURL=api.js.map