import { Sequelize } from "sequelize";
import "dotenv/config";

// Set sequelize based on environment
let sequelize;
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
  });
} else {
  sequelize = new Sequelize(
    process.env.TEST_DATABASE ?? process.env.DATABASE ?? "",
    process.env.DATABASE_USER ?? "",
    process.env.DATABASE_PASSWORD,
    {
      dialect: "postgres",
    }
  );
}

const models = {
  User: sequelize.import("./user"),
  Profile: sequelize.import("./profile"),
  Message: sequelize.import("./message"),
};

// Create associations between modelss
Object.keys(models).forEach((key) => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };

export default models;
