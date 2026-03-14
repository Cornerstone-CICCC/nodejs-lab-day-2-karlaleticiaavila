"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const users = [];
const findByUsername = (username) => {
    return users.find((user) => user.username.toLowerCase() === username.toLowerCase());
};
const login = async (username, password) => {
    const foundUser = findByUsername(username);
    if (!foundUser) {
        return null;
    }
    const isMatch = await bcrypt_1.default.compare(password, foundUser.password);
    if (!isMatch) {
        return null;
    }
    return foundUser;
};
const create = async (newUser) => {
    const foundUser = findByUsername(newUser.username);
    if (foundUser) {
        return null;
    }
    const hashedPassword = await bcrypt_1.default.hash(newUser.password, 10);
    const user = {
        id: (0, uuid_1.v4)(),
        username: newUser.username,
        password: hashedPassword,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
    };
    users.push(user);
    return user;
};
exports.default = {
    findByUsername,
    login,
    create,
};
