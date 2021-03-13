"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
require("dotenv/config");
let sequelize;
exports.sequelize = sequelize;
if (process.env.DATABASE_URL) {
    exports.sequelize = sequelize = new sequelize_1.Sequelize(process.env.DATABASE_URL, {
        dialect: "postgres",
    });
}
else {
    exports.sequelize = sequelize = new sequelize_1.Sequelize((_b = (_a = process.env.TEST_DATABASE) !== null && _a !== void 0 ? _a : process.env.DATABASE) !== null && _b !== void 0 ? _b : "", (_c = process.env.DATABASE_USER) !== null && _c !== void 0 ? _c : "", process.env.DATABASE_PASSWORD, {
        dialect: "postgres",
    });
}
const models = {
    User: sequelize.import("./user"),
    Profile: sequelize.import("./profile"),
    Message: sequelize.import("./message"),
};
Object.keys(models).forEach((key) => {
    if ("associate" in models[key]) {
        models[key].associate(models);
    }
});
exports.default = models;
//# sourceMappingURL=index.js.map