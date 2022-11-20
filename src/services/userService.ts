import * as argon2 from 'argon2';
import prisma from './dbService';
import { getRandomHash } from '../utils';

async function createUser(body: any) {
  return prisma.user.create({
    data: {
      avatar: body.avatar,
      name: body.name,
      password: await argon2.hash(body.password),
      email: body.email,
      hashLink: getRandomHash(),
    },
    select: {
      id: true,
      avatar: true,
      email: true,
      name: true,
      hashLink: true,
      password: false,
    },
  });
}

async function getUserByEmailAndPassword(email: string, password: string) {
  const user: any = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (user?.password && await argon2.verify(user.password, password)) {
    delete user.password;
    return user;
  }
  return null;
}

export {
  createUser, getUserByEmailAndPassword,
};
