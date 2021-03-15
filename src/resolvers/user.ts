// Generate token
import jwt from "jsonwebtoken";
// Allow for authentications
import { combineResolvers } from "graphql-resolvers";
// Apollo error handling
import { AuthenticationError, UserInputError } from "apollo-server";
// Check if user has admin role
import { isAdmin, isUser } from "./authorization";

// Generate token
const createToken = async (user, secret, expiresIn) => {
  const { id, email, username, role } = user;
  return await jwt.sign({ id, email, username, role }, secret, {
    expiresIn,
  });
};

export default {
  Query: {
    // Multiple Users
    getUsers: async (_parent, _args, { models }) => {
      const users = await models.User.findAll({
        include: [
          {
            model: models.Profile,
          },
        ],
      });
      return users;
    },
    // Single User
    getUser: async (_parent, { id }, { models }) => {
      return await models.User.findByPk(id);
    },
    // Current User
    me: async (_parent, _args, { models, me }) => {
      if (!me) {
        return null;
      }
      return await models.User.findByPk(me.id, {
        include: [
          {
            model: models.Profile,
          },
        ],
      });
    },
  },
  Mutation: {
    // Add user with hashed password
    registerUser: async (_parent, args, { models, secret }) => {
      const newUser = await models.User.create({
        ...args,
      });

      return {
        token: createToken(newUser, secret, "30 days"),
        user: newUser,
      };
    },
    // Sign in user based on user input.
    loginUser: async (
      _parent,
      // Login can be username or email
      { login, password },
      { models, secret }
    ) => {
      const user = await models.User.findByLogin(login);
      // Throw user input error if no user found
      if (!user) {
        throw new UserInputError("No user found with this login credentials.");
      }

      // Boolean variable if password if valid
      const isValid = await user.validatePassword(password);

      // If password is not valid, through authentication error
      if (!isValid) {
        throw new AuthenticationError("Invalid password.");
      }
      console.log(user);
      // Return token for client
      return { user, token: createToken(user, secret, "30 days") };
    },
    // Delete a user
    deleteUser: combineResolvers(
      isUser || isAdmin,
      async (_parent, { id }, { models }) => {
        return await models.User.destroy({
          where: { id },
        });
      }
    ),
    // Delete a user
    updateUser: combineResolvers(
      isUser || isAdmin,
      async (_parent, args, { models }) => {
        console.log(args);
        let user = await models.User.findByPk(args.id);

        user.username = args.username ? args.username : user.username;
        user.email = args.email ? args.email : user.email;

        await user.update({
          username: user.username,
          email: user.email,
        });

        return await models.User.findByPk(args.id);
      }
    ),
  },
  // Define User message type return value
  // User: {
  //   profile: async (user, args, { models }) => {
  //     return await models.Profile.findAll({
  //       where: {
  //         userId: user.id,
  //       },
  //     });
  //   },
  // },
};
