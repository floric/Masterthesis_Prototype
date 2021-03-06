import { ApolloContext, User } from '@masterthesis/shared';

import { AuthenticationError, ForbiddenError } from 'apollo-server-core';
import { compare, hash } from 'bcrypt';
import { Db, ObjectID } from 'mongodb';

import { Log } from '../../logging';
import { Omit } from '../../main';
import { getSafeObjectID } from '../utils';

const getUsersCollection = <T = User & { _id: ObjectID; pw: string }>(db: Db) =>
  db.collection<T>('Users');

export const login = async (
  mail: string,
  pw: string,
  reqContext: ApolloContext
): Promise<User | null> => {
  const user = await getFullUserByMail(mail, reqContext);
  if (!user) {
    Log.info(`Failed login with invalid mail`);
    return null;
  }

  const isPwCorrect = await compare(pw, user.pw);
  if (!isPwCorrect) {
    Log.info(`Failed login with password`);
    return null;
  }

  const id = user._id.toHexString();

  Log.info(`Successful login: ${id}`);

  return {
    id,
    mail: user.mail,
    firstName: user.firstName,
    lastName: user.lastName
  };
};

const getFullUserByMail = async (mail: string, reqContext: ApolloContext) => {
  const coll = getUsersCollection(reqContext.db);
  return await coll.findOne({ mail });
};

export const getUser = async (
  reqContext: ApolloContext
): Promise<User | null> => {
  if (!reqContext.userId) {
    return null;
  }

  const coll = getUsersCollection(reqContext.db);
  const res = await coll.findOne({ _id: getSafeObjectID(reqContext.userId) });

  if (!res) {
    return null;
  }

  return {
    id: res._id.toHexString(),
    mail: res.mail,
    firstName: res.firstName,
    lastName: res.lastName
  };
};

export const register = async (
  firstName: string,
  lastName: string,
  mail: string,
  pw: string,
  reqContext: ApolloContext
): Promise<User | null> => {
  const saltedPw = await hash(pw, 10);
  const coll = getUsersCollection<Omit<User, 'id'> & { pw: string }>(
    reqContext.db
  );
  await coll.createIndex('mail', {
    unique: true
  });
  try {
    const res = await coll.insertOne({
      firstName,
      lastName,
      mail,
      pw: saltedPw
    });

    if (res.insertedCount !== 1) {
      throw new Error('Creating user failed');
    }

    const user = res.ops[0];

    Log.info(`Successful registration`);

    return {
      id: user._id.toHexString(),
      mail: user.mail,
      firstName: user.firstName,
      lastName: user.lastName
    };
  } catch (err) {
    if (err.code === 11000) {
      return null;
    }

    throw new Error('Unknown registration error');
  }
};

export const tryGetUser = async (reqContext: ApolloContext): Promise<User> => {
  const user = await getUser(reqContext);
  if (!user) {
    throw new ForbiddenError('Unknown user');
  }

  return user;
};

export const checkLoggedInUser = (reqContext: ApolloContext) => {
  const { userId } = reqContext;
  if (userId == null) {
    throw new AuthenticationError('User is not authorized');
  }
};
