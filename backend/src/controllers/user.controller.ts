import { Request, Response } from 'express';
import userModel from '../models/user.model';
import { User } from '../types/user.types';
import zxcvbn from 'zxcvbn';

const getUserByUsername = (req: Request, res: Response) => {
  const username = req.signedCookies.username;

  if (!username) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  const foundUser = userModel.findByUsername(username);

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

const loginUser = async (
  req: Request<{}, {}, { username: string; password: string }>,
  res: Response,
) => {
  const { username, password } = req.body;

  if (!username?.trim() || !password?.trim()) {
    res.status(400).json({ error: 'Missing username or password' });
    return;
  }

  const foundUser = await userModel.login(username, password);

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

const addUser = async (
  req: Request<{}, {}, Omit<User, 'id'>>,
  res: Response,
) => {
  const { username, password, firstname, lastname } = req.body;

  if (
    !username?.trim() ||
    !password?.trim() ||
    !firstname?.trim() ||
    !lastname?.trim()
  ) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  const passwordScore = zxcvbn(password).score;

  if (passwordScore <= 2) {
    res.status(400).json({ error: 'Password is too weak' });
    return;
  }

  const newUser = await userModel.create({
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

const logout = (req: Request, res: Response) => {
  res.clearCookie('username');
  res.status(200).json({ message: 'Logged out' });
};

export default {
  getUserByUsername,
  loginUser,
  addUser,
  logout,
};