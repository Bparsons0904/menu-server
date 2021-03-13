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
const graphql_resolvers_1 = require("graphql-resolvers");
const authorization_1 = require("./authorization");
exports.default = {
    Query: {
        getUserProfile: (_parent, { userId }, { models }) => __awaiter(void 0, void 0, void 0, function* () {
            const userProfile = yield models.UserProfile.findAll({
                where: {
                    userId: userId,
                },
            });
            console.log(userProfile);
            return userProfile[0];
        }),
        getProfile: (_parent, { id }, { models }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield models.User.findByPk(id);
            const profile = yield models.UserProfile.findAll({
                where: {
                    userId: id,
                },
            });
            const userProfile = profile[0];
            return { userProfile, user };
        }),
        getUserProfiles: (_parent, { active }, { models }) => __awaiter(void 0, void 0, void 0, function* () {
            let userProfile;
            console.log(active);
            if (active) {
                userProfile = yield models.UserProfile.findAll({
                    where: {
                        active: active,
                    },
                });
            }
            else {
                userProfile = yield models.UserProfile.findAll();
            }
            return userProfile;
        }),
    },
    Mutation: {
        createProfile: graphql_resolvers_1.combineResolvers(authorization_1.isAuthenticated || authorization_1.isAdmin, (_parent, args, { models }) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(args);
            const userProfile = yield models.UserProfile.create(Object.assign({}, args));
            const user = yield models.User.findByPk(args.userId);
            yield user.update({ completedProfile: true });
            return userProfile;
        })),
        updateProfile: graphql_resolvers_1.combineResolvers(authorization_1.isAuthenticated || authorization_1.isAdmin, (_parent, args, { models }) => __awaiter(void 0, void 0, void 0, function* () {
            let userProfile = yield models.UserProfile.findByPk(args.id);
            const newStatement = args.statement
                ? args.statement
                : userProfile.statement;
            const newEducation = args.education
                ? args.education
                : userProfile.education;
            const newWorkExperience = args.workExperience
                ? args.workExperience
                : userProfile.workExperience;
            const newLookingFor = args.lookingFor
                ? args.lookingFor
                : userProfile.lookingFor;
            const newSkills = args.skills ? args.skills : userProfile.skills;
            const newActive = args.active ? args.active : userProfile.active;
            const newAddress1 = args.address1
                ? args.address1
                : userProfile.address1;
            const newAddress2 = args.address2
                ? args.address2
                : userProfile.address2;
            const newCity = args.city ? args.city : userProfile.city;
            const newState = args.state ? args.state : userProfile.state;
            const newZip = args.zip ? args.zip : userProfile.zip;
            const newCountry = args.country ? args.country : userProfile.country;
            userProfile = yield userProfile.update({
                statement: newStatement,
                education: newEducation,
                workExperience: newWorkExperience,
                lookingFor: newLookingFor,
                skills: newSkills,
                active: newActive,
                address1: newAddress1,
                address2: newAddress2,
                city: newCity,
                state: newState,
                zip: newZip,
                country: newCountry,
            });
            return userProfile;
        })),
    },
};
//# sourceMappingURL=profile.js.map