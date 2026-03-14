import { User } from '../types/user.types';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';

const users: User[] = [];

const findByUsername = (username: string): User | undefined => {
  return users.find(
    (user) => user.username.toLowerCase() === username.toLowerCase(),
  );
};

const login = async (
  username: string,
  password: string,
): Promise<User | null> => {
  const foundUser = findByUsername(username);

  if (!foundUser) {
    return null;
  }

  const isMatch = await bcrypt.compare(password, foundUser.password);

  if (!isMatch) {
    return null;
  }

  return foundUser;
};

const create = async (
  newUser: Omit<User, 'id'>,
): Promise<User | null> => {
  const foundUser = findByUsername(newUser.username);

  if (foundUser) {
    return null;
  }

  const hashedPassword = await bcrypt.hash(newUser.password, 10);

  const user: User = {
    id: uuid(),
    username: newUser.username,
    password: hashedPassword,
    firstname: newUser.firstname,
    lastname: newUser.lastname,
  };

  users.push(user);
  return user;
};

export default {
  findByUsername,
  login,
  create,
};