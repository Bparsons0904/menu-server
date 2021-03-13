"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const message = (sequelize, DataTypes) => {
    const Message = sequelize.define("message", {
        text: {
            type: DataTypes.STRING,
        },
    });
    return Message;
};
exports.default = message;
//# sourceMappingURL=message.js.map