// Password hash crypto
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

// Define user with validation requirements
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
      // validate: {
      //   notEmpty: {
      //     args: true,
      //     msg: "Username required.",
      //   },
      //   len: {
      //     args: [5, 20],
      //     msg: "Username length of 5-20 required.",
      //   },
      // },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      // validate: {
      //   notEmpty: true,
      //   isEmail: true,
      //   msg: "Valid email is required",
      // },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      // validate: {
      //   notEmpty: true,
      //   len: [7, 42],
      //   msg: "Password length of 7-42 required.",
      // },
    },
  });

  User.associate = (models) => {
    User.hasOne(models.Profile);
  };

  // Define user by login value
  User.findByLogin = async (login) => {
    // Attempt to find user based on username
    let user = await User.findOne({
      where: { username: login },
    });

    // If user not found my username, find by email
    if (!user) {
      user = await User.findOne({
        where: { email: login },
      });
    }
    return user;
  };

  // Create hash of inputted password
  User.beforeCreate(async (user) => {
    user.password = await user.generatePasswordHash();
    user.id = uuidv4();
  });

  // Create hash of inputted password
  User.beforeUpdate(async (user) => {
    user.password = await user.generatePasswordHash();
  });

  // Generate password hash using bcrypt
  User.prototype.generatePasswordHash = async function () {
    const saltRounds = 10;
    return await bcrypt.hash(this.password, saltRounds);
  };

  // Validate stored user password with user input
  User.prototype.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  return User;
};

export default user;
