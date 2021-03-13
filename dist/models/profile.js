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
const uuid_1 = require("uuid");
const profile = (sequelize, DataTypes) => {
    const Profile = sequelize.define("profile", {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
        },
        firstName: {
            type: DataTypes.STRING,
        },
        lastName: {
            type: DataTypes.STRING,
        },
        role: {
            type: DataTypes.STRING,
        },
    });
    Profile.associate = (models) => {
        Profile.belongsTo(models.User);
    };
    Profile.beforeCreate((profile) => __awaiter(void 0, void 0, void 0, function* () {
        profile.id = uuid_1.v4();
    }));
    return Profile;
};
exports.default = profile;
//# sourceMappingURL=profile.js.map