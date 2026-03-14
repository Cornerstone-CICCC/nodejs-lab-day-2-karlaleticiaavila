"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const zxcvbn_1 = __importDefault(require("zxcvbn"));
const getUserByUsername = (req, res) => {
    const username = req.signedCookies.username;
    if (!username) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }
    const foundUser = user_model_1.default.findByUsername(username);
    if (!foundUser) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    res.status(200).json({
        username: foundUser.username,
        firstname: foundUser.firstname,
        lastname: foundUser.lastname,
    });
};
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    if (!username?.trim() || !password?.trim()) {
        res.status(400).json({ error: 'Missing username or password' });
        return;
    }
    const foundUser = await user_model_1.default.login(username, password);
    if (!foundUser) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
    }
    res.cookie('username', foundUser.username, {
        maxAge: 10 * 60 * 1000,
        httpOnly: true,
        signed: true,
    });
    res.status(200).json({ message: 'Login successful' });
};
const addUser = async (req, res) => {
    const { username, password, firstname, lastname } = req.body;
    if (!username?.trim() ||
        !password?.trim() ||
        !firstname?.trim() ||
        !lastname?.trim()) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }
    const passwordScore = (0, zxcvbn_1.default)(password).score;
    if (passwordScore <= 2) {
        res.status(400).json({ error: 'Password is too weak' });
        return;
    }
    const newUser = await user_model_1.default.create({
        username,
        password,
        firstname,
        lastname,
    });
    if (!newUser) {
        res.status(409).json({ error: 'Username already taken' });
        return;
    }
    res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
    });
};
const logout = (req, res) => {
    res.clearCookie('username');
    res.status(200).json({ message: 'Logged out' });
};
exports.default = {
    getUserByUsername,
    loginUser,
    addUser,
    logout,
};
