import { v4 as uuidv4 } from "uuid";

// Define userProfile model with validation
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

  Profile.beforeCreate(async (profile) => {
    profile.id = uuidv4();
  });

  return Profile;
};

export default profile;
