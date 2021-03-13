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
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const user = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
    User.associate = (models) => {
        User.hasOne(models.Profile);
    };
    User.findByLogin = (login) => __awaiter(void 0, void 0, void 0, function* () {
        let user = yield User.findOne({
            where: { username: login },
        });
        if (!user) {
            user = yield User.findOne({
                where: { email: login },
            });
        }
        return user;
    });
    User.beforeCreate((user) => __awaiter(void 0, void 0, void 0, function* () {
        user.password = yield user.generatePasswordHash();
        user.id = uuid_1.v4();
    }));
    User.beforeUpdate((user) => __awaiter(void 0, void 0, void 0, function* () {
        user.password = yield user.generatePasswordHash();
    }));
    User.prototype.generatePasswordHash = function () {
        return __awaiter(this, void 0, void 0, function* () {
            const saltRounds = 10;
            return yield bcrypt_1.default.hash(this.password, saltRounds);
        });
    };
    User.prototype.validatePassword = function (password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.compare(password, this.password);
        });
    };
    return User;
};
exports.default = user;
//# sourceMappingURL=user.js.map